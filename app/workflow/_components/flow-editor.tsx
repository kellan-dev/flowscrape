"use client";

import "@xyflow/react/dist/style.css";
import { Workflow } from "@prisma/client";
import React, { useCallback, useEffect } from "react";
import {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  getOutgoers,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import { createFlowNode } from "@/lib/workflow/create-flow-node";
import { TaskType } from "@/types/task";
import NodeComponent from "./nodes/node-component";
import { AppNode } from "@/types/app-node";
import DeletableEdge from "./edges/deletable-edge";
import { TaskRegistry } from "@/lib/workflow/task/registry";

const nodeTypes = {
  FlowScrapeNode: NodeComponent,
};

const edgeTypes = {
  default: DeletableEdge,
};

const snapGrid: [number, number] = [16, 16];
const fitViewOptions = { padding: 1 };

export default function FlowEditor({ workflow }: { workflow: Workflow }) {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { setViewport, screenToFlowPosition, updateNodeData } = useReactFlow();

  useEffect(() => {
    try {
      const flow = JSON.parse(workflow.definition);
      if (!flow) return;

      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);

      if (!flow.viewport) return;

      // Disable the fitView option to restore this saved viewport
      const { x = 0, y = 0, zoom = 1 } = flow.viewport;
      setViewport({ x, y, zoom });
    } catch (error) {
      console.error(error);
    }
  }, [workflow.definition, setNodes, setEdges, setViewport]);

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const taskType = event.dataTransfer.getData("application/reactflow");
      // TODO: Why the undefined check?
      if (!taskType || typeof taskType === undefined) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = createFlowNode(taskType as TaskType, position);
      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes],
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds));
      if (!connection.targetHandle) return;

      // Remove input value if present on connection
      const node = nodes.find((n) => n.id === connection.target);
      if (!node) return;

      const nodeInputs = node.data.inputs;
      updateNodeData(node.id, {
        inputs: {
          ...nodeInputs,
          [connection.targetHandle]: "",
        },
      });
    },
    [updateNodeData, nodes, setEdges],
  );

  const isValidConnection = useCallback(
    (connection: Edge | Connection) => {
      // A node can't connect to itself
      if (connection.source === connection.target) {
        console.error("Invalid Connection: Source and target are the same");
        return false;
      }

      // A node can't connect to a node of a different type
      const source = nodes.find((node) => node.id === connection.source);
      const target = nodes.find((node) => node.id === connection.target);
      if (!source || !target) {
        console.error("Invalid Connection: Source or target node not found");
        return false;
      }

      const sourceTask = TaskRegistry[source.data.type];
      const targetTask = TaskRegistry[target.data.type];

      const sourceOutput = sourceTask.outputs.find(
        (output) => output.name === connection.sourceHandle,
      );
      const targetInput = targetTask.inputs.find(
        (input) => input.name === connection.targetHandle,
      );

      if (!sourceOutput || !targetInput) {
        console.error("Invalid Connection: Input or output not found");
        return false;
      }

      if (sourceOutput?.type !== targetInput?.type) {
        console.error("Invalid Connection: Types do not match");
        return false;
      }

      // A node can't connect if it would create a cycle (loop)
      const hasCycle = (node: AppNode, visited = new Set()) => {
        if (visited.has(node.id)) return false;
        visited.add(node.id);

        for (const outgoer of getOutgoers(node, nodes, edges)) {
          if (outgoer.id === connection.source) return true;
          if (hasCycle(outgoer, visited)) return true;
        }
      };

      const detectedCycle = hasCycle(target);

      return !detectedCycle;
    },
    [nodes, edges],
  );

  return (
    <main className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        snapToGrid
        snapGrid={snapGrid}
        // fitView
        fitViewOptions={fitViewOptions}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
      >
        <Controls position="top-left" fitViewOptions={fitViewOptions} />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </main>
  );
}
