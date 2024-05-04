"use client";

import { toast } from "sonner";
import { useCallback, useEffect, useState } from "react";
import { DragDropContext, DropResult, Droppable } from "@hello-pangea/dnd";

import { ListWithCards } from "@/types";
import { useAction } from "@/hooks/use-action";
import { updateListOrder } from "@/actions/update-list-order";

import { ListItem } from "./list-item";
import { ListForm } from "./list-form";
import { updateCardOrder } from "@/actions/update-card-order";
interface ListContainerProps {
  boardId: string;
  data: ListWithCards[];
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

export const ListContainer = ({ boardId, data }: ListContainerProps) => {
  const [orderdData, setOrderdData] = useState<ListWithCards[]>(data);

  const { execute: executeReorderList } = useAction(updateListOrder, {
    onSuccess: () => {
      toast.success("List order updated!");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const { execute: executeReorderCard } = useAction(updateCardOrder, {
    onSuccess() {
      toast.success("Card order updated!");
    },
    onError(error) {
      toast.error(error);
    },
  });

  useEffect(() => {
    setOrderdData(data);
  }, [data]);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { destination, source, type } = result;

      if (!destination) {
        return;
      }

      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        return;
      }

      if (type === "list") {
        const items = reorder(orderdData, source.index, destination.index).map(
          (item, idx) => {
            return {
              ...item,
              order: idx,
            };
          }
        );
        setOrderdData(items);
        executeReorderList({ items, boardId });
      }

      if (type === "card") {
        let newOrderedData = [...orderdData];

        // Find data the source list
        const sourceList = orderdData.find(
          (list) => list.id === source.droppableId
        );

        // Find data the destination list
        const destinationList = orderdData.find(
          (list) => list.id === destination.droppableId
        );

        if (!sourceList || !destinationList) return;

        if (!sourceList.cards) {
          sourceList.cards = [];
        }

        if (!destinationList.cards) {
          destinationList.cards = [];
        }

        // Move card to same list
        if (source.droppableId === destination.droppableId) {
          const reorderdCards = reorder(
            sourceList.cards,
            source.index,
            destination.index
          );

          reorderdCards.forEach((card, idx) => {
            card.order = idx;
          });

          sourceList.cards = reorderdCards;

          setOrderdData(newOrderedData);
          executeReorderCard({
            items: reorderdCards,
            boardId,
          });
        } else {
          // Remove card from source list
          const [removed] = sourceList.cards.splice(source.index, 1);

          // Assaign  the new listId to the card
          removed.listId = destination.droppableId;

          // Add card to destination list
          destinationList.cards.splice(destination.index, 0, removed);

          // update order
          sourceList.cards.forEach((card, idx) => {
            card.order = idx;
          });

          destinationList.cards.forEach((card, idx) => {
            card.order = idx;
          });

          setOrderdData(newOrderedData);
          executeReorderCard({
            items: destinationList.cards,
            boardId,
          });
        }
      }
    },
    [boardId, executeReorderCard, executeReorderList, orderdData]
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable type="list" droppableId="lists" direction="horizontal">
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex h-full gap-x-3"
          >
            {orderdData.map((list, index) => (
              <ListItem key={list.id} data={list} index={index} />
            ))}
            <ListForm />
            <div className="flex-shrink-0 w-1"></div>
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};
