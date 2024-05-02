import { cn } from "@/lib/utils";
import { ListWithCards } from "@/types";
import { useCallback, useRef, useState } from "react";

import ListHeader from "./list-header";
import { CardForm } from "./card-form";
import { CardItem } from "./card-item";
import { Draggable, Droppable } from "@hello-pangea/dnd";

type Props = {
  data: ListWithCards;
  index: number;
};

const ListItem = ({ data, index }: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [isEditing, setIsEditing] = useState(false);

  const disableEditing = useCallback(() => {
    setIsEditing(false);
  }, []);

  const enableEditing = useCallback(() => {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    });
  }, []);

  {
    /* 
    TODO: Add a feature to add a new card to the list
     */
  }
  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <li
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="shrink-0 w-[272px] h-full select-none"
        >
          <div
            {...provided.dragHandleProps}
            className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2"
          >
            <ListHeader data={data} onAddCard={enableEditing} />
            <Droppable droppableId={data.id} type="card">
              {(provided) => (
                <ol
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    "mx-1 px-1 py-0.5 flex flex-col gap-y-2",
                    data.cards.length > 0 ? "mt-2" : "mt-0"
                  )}
                >
                  {data.cards.map((card, index) => (
                    <CardItem key={card.id} data={card} index={index} />
                  ))}
                  {provided.placeholder}
                </ol>
              )}
            </Droppable>

            <CardForm
              listId={data.id}
              ref={textareaRef}
              isEditing={isEditing}
              enableEditing={enableEditing}
              disableEditing={disableEditing}
            />
          </div>
        </li>
      )}
    </Draggable>
  );
};

export default ListItem;
