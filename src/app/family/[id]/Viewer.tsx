"use client";

import {
  addEdge,
  Background,
  Controls,
  Handle,
  MarkerType,
  MiniMap,
  Position,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Connection,
  type Node,
} from "@xyflow/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { EyeOpenIcon, PlusIcon, ReloadIcon } from "@radix-ui/react-icons";
import "@xyflow/react/dist/style.css";
import { useTheme } from "next-themes";
import Image from "next/image";

import dynamic from "next/dynamic";
import { Button } from "~/components/ui/button";
import { SaveIcon } from "~/icon";
import { api } from "~/trpc/react";
import ShowAlertMessage from "~/util/ShowAlertMessage";
import { uuid } from "~/util/uuid";
import { Member, type Family } from "../DataObject";
import { useSession } from "next-auth/react";

const MemberDetailViewer = dynamic(
  () => import("../[id]/components/MemberDetailViewer"),
  {
    // loading: () => <p>Loading...</p>,
  },
);
const AddMember = dynamic(() => import("./components/AddMember"), {
  // loading: () => <p>Loading...</p>,
});
const SelectRelation = dynamic(() => import("./components/SelectRelation"), {
  // loading: () => <p>Loading...</p>,
});

interface Props {
  objFamily: Family;
}

export default function Viewer({ objFamily }: Props) {
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const EdgeParamRef = useRef<Connection | null>(null);
  const [SelectedMember, setSelectedMember] = useState<Member>(new Member());
  const [ShowAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [ShowRelationModel, setShowRelationModel] = useState(false);
  const { theme } = useTheme();
  const utils = api.useUtils();
  const { data } = useSession();

  const [ShowMemberDetail, setShowMemberDetail] = useState<boolean>(false);

  const nodeTypes = useMemo(
    () => ({
      MemberNode: CustomNode,
    }),
    [],
  );
  useEffect(() => {
    setEdges(objFamily.edge);
    setNodes(objFamily.node);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _AddMember = api.Family.addNodeAndEdge.useMutation({
    onError(error) {
      ShowAlertMessage(
        "Error",
        `Adding Member failed: ${error.message}`,
        "error",
      );
    },
    onSuccess: async (data) => {
      ShowAlertMessage(
        "Success",
        `Member added successfully: ${data}`,
        "success",
      );
      await utils.Family.invalidate();
    },
  });

  const onAddRelation = async (relation: string) => {
    try {
      if (EdgeParamRef.current === null) return;

      const edgeConfig = {
        label: relation as any,
        markerEnd: {
          color: getRelationColor(relation),
          type: MarkerType.Arrow,
        },
        style: { strokeWidth: 2, stroke: getRelationColor(relation) },
        type: getEdgeType(relation),
        animated: relation === "Spouse",
        id: uuid(),
      };

      setShowRelationModel(false);
      setEdges((eds) =>
        addEdge({ ...EdgeParamRef.current!, ...edgeConfig }, eds),
      );

      const { source, target } = EdgeParamRef.current;

      // Get the current positions of the nodes
      const sourceNode = nodes.find((node) => node.id === source);
      const targetNode = nodes.find((node) => node.id === target);

      if (sourceNode && targetNode) {
        let newSourceX = sourceNode.position.x;
        let newSourceY = sourceNode.position.y;

        // Adjust node position based on the relation type
        if (relation !== "Spouse") {
          // Move source node to the left of the target node
          newSourceX = targetNode.position.x - 200;
          // newSourceY = targetNode.position.y;
        }
        if (
          relation !== "Spouse" &&
          relation !== "Children" &&
          relation !== "Parent"
        ) {
          // Move source node to the left of the target node
          newSourceX = targetNode.position.x + 200;
          // newSourceY = targetNode.position.y;
        }
        if (relation === "Parent") {
          // Move source node above the target node
          // newSourceX = targetNode.position.x;
          newSourceY = targetNode.position.y + 200;
        }
        if (relation === "Children") {
          // Move source node below the target node
          // newSourceX = targetNode.position.x;
          newSourceY = targetNode.position.y + 200;
        }

        updateNodePosition(sourceNode.id, newSourceX, newSourceY);
      }
    } catch (error: any) {
      ShowAlertMessage(
        "Error",
        `Failed to add relation: ${error.message}`,
        "error",
      );
    }
  };

  const onConnect = useCallback(
    (params: Connection) => {
      try {
        EdgeParamRef.current = params;
        setShowRelationModel(true);
      } catch (error: any) {
        ShowAlertMessage(
          "Error",
          `Connection failed: ${error.message}`,
          "error",
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setEdges],
  );

  const AddNewNode = async (objMember: Member) => {
    try {
      const newNodes = [...nodes];
      const existingNodes = nodes.length;
      const newX = 100 + existingNodes * 150;
      // const newX = 100;
      const newY = 100;

      const newNode: Node = {
        id: objMember.id,
        data: {
          ...objMember,
          label: objMember.name,
          familyID: objFamily.id,
          createdBy: { id: data?.user.id, email: data?.user.email },
        },
        position: { x: newX, y: newY },
        type: "MemberNode",
        draggable: true,
        dragging: true,
      };
      newNodes.push(newNode);

      console.log(objMember);

      //   sessionStorage.setItem("Node", Crypt.Encryption(newNodes).data!);
      // sessionStorage.setItem("Edge", Crypt.Encryption(edges).data!);

      setNodes(newNodes);
      setShowAddMemberDialog(false);
    } catch (error: any) {
      ShowAlertMessage(
        "Error",
        `Failed to add member: ${error.message}`,
        "error",
      );
    }
  };

  const updateNodePosition = (nodeId: string, newX: number, newY: number) => {
    let Node: Node[] = JSON.parse(JSON.stringify(nodes));

    for (let index = 0; index < Node.length; index++) {
      debugger;
      const element = Node[index];
      if (element?.id === nodeId) {
        Node[index] = { ...Node[index], position: { x: newX, y: newY } } as any;
        break;
      }
    }

    setNodes(Node as any);
  };

  const SaveDataToDB = () => {
    try {
      _AddMember.mutate({
        edge: edges,
        familyID: objFamily.id!,
        node: nodes,
      });
    } catch (error: any) {
      ShowAlertMessage(
        "Error",
        `Failed to save data: ${error.message}`,
        "error",
      );
    }
  };

  // ----------------------------------------------------- custom

  function CustomNode({ data }: CustomNodeProps) {
    return (
      <div className="relative h-auto w-auto">
        {data.photo && (
          <div className="flex min-h-[9rem] min-w-[8rem] flex-col overflow-hidden rounded-xl border-gray-600 bg-white dark:bg-black">
            <Image
              src={data.photo}
              alt={data.label}
              className="h-[7rem] w-full cursor-pointer rounded-md object-cover"
              height={50}
              width={50}
            />
            <div className="h-[2rem] w-full bg-gray-300 p-2 dark:bg-black">
              <p className="text-sm text-black text-muted-foreground dark:text-white">
                {data.name}
              </p>
            </div>
          </div>
        )}

        {data.photo === "" && (
          <div className="flex items-center justify-center rounded-xl border-2 border-gray-600 bg-white px-8 py-4 dark:bg-black">
            <h4 className="scroll-m-20 text-xl tracking-tight">{data.name}</h4>
          </div>
        )}
        <Handle
          type="source"
          position={Position.Top}
          className="bg-black dark:bg-white"
          isConnectable
        />
        <Handle
          type="source"
          position={Position.Right}
          className="bg-black dark:bg-white"
          isConnectable
          id="right"
        />
        <Handle
          type="target"
          position={Position.Bottom}
          className="bg-black dark:bg-white"
          isConnectable
        />
        <Handle
          type="target"
          position={Position.Left}
          className="bg-black dark:bg-white"
          isConnectable
          id="left"
        />

        <div
          className="absolute bottom-2 right-2 cursor-pointer"
          onClick={() => {
            setSelectedMember(data);
            setShowMemberDetail(true);
          }}
        >
          <EyeOpenIcon className="h-4 w-4" />
        </div>
      </div>
    );
  }

  // ----------------------

  return (
    <div className="relative h-full w-full">
      <h3 className="absolute left-5 top-4 z-10 text-2xl font-semibold">
        {/* {objFamily.familyName}
         */}
        Family Name
      </h3>

      <Button
        className="absolute right-[11rem] top-4 z-10"
        onClick={SaveDataToDB}
      >
        {_AddMember.isPending ? (
          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <SaveIcon className="mr-2 h-4 w-4" />
        )}
        Save
      </Button>

      <Button
        className="absolute right-5 top-4 z-10"
        onClick={() => setShowAddMemberDialog(true)}
      >
        <PlusIcon className="mr-2 h-4 w-4" />
        New Member
      </Button>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={(changes) =>
          onEdgesChange(changes.filter((change) => change.type !== "add"))
        }
        defaultEdgeOptions={{
          animated: true,
          type: "smoothstep",
          style: { stroke: "#0072ff", strokeWidth: 3 },
        }}
        onConnect={onConnect}
        fitView
        className="h-full w-full"
        nodeTypes={nodeTypes}
        draggable
        colorMode={theme as "system" | "light" | "dark"}
        onNodeDragStop={(event, node) => {
          updateNodePosition(node.id, node.position.x, node.position.y);
        }}
        // markers={[markerEnd]}
      >
        <MiniMap />
        <Background className="text-gray-500" gap={8} />
        <Controls />
      </ReactFlow>

      {ShowAddMemberDialog && (
        <AddMember
          AddNewNode={AddNewNode}
          open={ShowAddMemberDialog}
          onClose={() => setShowAddMemberDialog(false)}
        />
      )}

      {ShowRelationModel && (
        <SelectRelation
          open={ShowRelationModel}
          onSelectrelation={onAddRelation}
          onClose={() => setShowRelationModel(false)}
        />
      )}

      {ShowMemberDetail && (
        <MemberDetailViewer
          objMember={SelectedMember}
          onClose={() => setShowMemberDetail(false)}
          open={ShowMemberDetail}
        />
      )}
    </div>
  );
}

interface CustomNodeProps {
  data: Member;
}

function getRelationColor(relation: string) {
  switch (relation) {
    case "Parent":
      return "#0072ff";
    case "Spouse":
      return "#FF0072";
    case "Children":
      return "#16a34a";
    default:
      return "#ca8a04";
  }
}

function getEdgeType(relation: string) {
  switch (relation) {
    case "Parent":
      return "straight";
    case "Spouse":
      return "smoothstep";
    case "Children":
      return "step";
    default:
      return "default";
  }
}
