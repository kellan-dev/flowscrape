import { AppNode, AppNodeMissingInputs } from "@/types/app-node";
import {
  WorkflowExecutionPlan,
  WorkflowExecutionPlanPhase,
} from "@/types/workflow";
import { Edge } from "@xyflow/react";
import { TaskRegistry } from "./task/registry";

export enum FlowToExecutionPlanValidationError {
  "NO_ENTRY_POINT",
  "INVALID_INPUTS",
}

type FlowToExecutionPlanType = {
  executionPlan?: WorkflowExecutionPlan;
  error?: {
    type: FlowToExecutionPlanValidationError;
    invalidElements?: AppNodeMissingInputs[];
  };
};

export function flowToExecutionPlan(
  nodes: AppNode[],
  edges: Edge[],
): FlowToExecutionPlanType {
  const entryPoint = nodes.find(
    (node) => TaskRegistry[node.data.type].isEntryPoint,
  );
  if (!entryPoint) {
    return {
      error: {
        type: FlowToExecutionPlanValidationError.NO_ENTRY_POINT,
      },
    };
  }

  const inputsWithErrors: AppNodeMissingInputs[] = [];
  const planned = new Set<string>();

  const invalidInputs = getInvalidInputs(entryPoint, edges, planned);
  if (invalidInputs.length > 0) {
    inputsWithErrors.push({ nodeId: entryPoint.id, inputs: invalidInputs });
  }

  const executionPlan: WorkflowExecutionPlan = [
    {
      phase: 1,
      nodes: [entryPoint],
    },
  ];

  planned.add(entryPoint.id);

  for (
    let phase = 2;
    phase <= nodes.length && planned.size < nodes.length;
    phase++
  ) {
    const nextPhase: WorkflowExecutionPlanPhase = { phase, nodes: [] };

    for (const node of nodes) {
      if (planned.has(node.id)) continue;

      const invalidInputs = getInvalidInputs(node, edges, planned);
      if (invalidInputs.length > 0) {
        const incomers = getIncomers(node, nodes, edges);
        if (incomers.every((incomer) => planned.has(incomer.id))) {
          console.error("Invalid inputs:", node.id, invalidInputs);
          inputsWithErrors.push({ nodeId: node.id, inputs: invalidInputs });
        } else {
          continue;
        }
      }

      nextPhase.nodes.push(node);
    }
    for (const node of nextPhase.nodes) {
      planned.add(node.id);
    }

    executionPlan.push(nextPhase);
  }

  if (inputsWithErrors.length > 0) {
    return {
      error: {
        type: FlowToExecutionPlanValidationError.INVALID_INPUTS,
        invalidElements: inputsWithErrors,
      },
    };
  }

  return { executionPlan };
}

function getInvalidInputs(node: AppNode, edges: Edge[], planned: Set<string>) {
  const invalidInputs = [];
  const inputs = TaskRegistry[node.data.type].inputs;

  for (const input of inputs) {
    const inputValue = node.data.inputs[input.name];
    const inputValueProvided = inputValue?.length > 0;
    if (inputValueProvided) {
      // This input is fine, so we can move on
      continue;
    }

    // If a value is not provided by the user, then we need to check if there is
    // an output linked to the current input
    const incomingEdges = edges.filter((edge) => edge.target === node.id);

    const inputLinkedToOutput = incomingEdges.find(
      (edge) => edge.targetHandle === input.name,
    );

    const requiredInputProvidedByVisitedOutput =
      input.required &&
      inputLinkedToOutput &&
      planned.has(inputLinkedToOutput.source);

    if (requiredInputProvidedByVisitedOutput) {
      // The required input is provided by a node that has already been visited
      continue;
    } else if (!input.required) {
      if (!inputLinkedToOutput) {
        // If the input is not required, and there is no edge to the input, then
        // we can move on
        continue;
      }
      if (inputLinkedToOutput && planned.has(inputLinkedToOutput.source)) {
        // If the input is not required, and there is an edge to the input, but
        // the source node has already been visited, then we can move on
        continue;
      }
    }

    invalidInputs.push(input.name);
  }

  return invalidInputs;
}

function getIncomers(node: AppNode, nodes: AppNode[], edges: Edge[]) {
  if (!node.id) return [];

  const incomersIds = new Set();
  edges.forEach((edge) => {
    if (edge.target === node.id) {
      incomersIds.add(edge.source);
    }
  });

  return nodes.filter((node) => incomersIds.has(node.id));
}
