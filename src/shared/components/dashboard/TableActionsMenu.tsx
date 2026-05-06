import React from "react";
import { Edit3, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

type Props = Readonly<{
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  viewLabel?: string;
  editLabel?: string;
  deleteLabel?: string;
}>;

export const TableActionsMenu: React.FC<Props> = ({
  onView,
  onEdit,
  onDelete,
  viewLabel = "View",
  editLabel = "Edit",
  deleteLabel = "Delete",
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={(event) => event.stopPropagation()}
      >
        <MoreHorizontal size={15} />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuItem
        onClick={(event) => {
          event.stopPropagation();
          onView();
        }}
      >
        <Eye className="mr-2 h-4 w-4" />
        {viewLabel}
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={(event) => {
          event.stopPropagation();
          onEdit();
        }}
      >
        <Edit3 className="mr-2 h-4 w-4" />
        {editLabel}
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        className="text-[#b42318] focus:text-[#b42318]"
        onClick={(event) => {
          event.stopPropagation();
          onDelete();
        }}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        {deleteLabel}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
