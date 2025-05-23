import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitOnEnter } from "@/components/ui/submit-on-enter";
import { replaceWhitespace } from "@/lib/string";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { useFileSystem } from "@/hooks/use-file-system.ts";
import { FileTypes } from "@/features/project/filetype-icons.tsx";

type ProjectType = "create" | "inspect";

interface Props {
  close: () => void;
}

export function NewProjectDialog({ close }: Props) {
  const [name, setName] = useState("");
  const [projectType, setProjectType] = useState<ProjectType | string>(
    "create",
  );

  const fs = useFileSystem()
  const canSubmit = name.length > 3;

  const handleCreateClicked = async () => {
    if (!canSubmit) return;

    const folderId = await fs.createFolder("/", name);
    const fileName = replaceWhitespace(name);

    if (projectType === "create") {
      await fs.addFile(folderId, `${fileName.toLowerCase()}.scd.json`, FileTypes.SCD, null )
    }

    close();
  };

  const description = projectType === "create"
    ? "Add a new Smart Contract project to your workspace."
    : "Create a Smart Contract inspection project";

  return (
    <DialogContent className="sm:max-w-[425px]">
      <SubmitOnEnter onSubmit={handleCreateClicked} isEnabled={canSubmit}>
        <DialogHeader>
          <DialogTitle>New Project</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <section className="flex flex-col gap-y-2 my-4">
          <Label htmlFor="type">Project Type</Label>
          <Select name="type" value={projectType} onValueChange={setProjectType}>
            <SelectTrigger>
              <SelectValue placeholder="Select Project Type" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value={"create"}>
                  Create new Smart Contract
                </SelectItem>
                <SelectItem value={"inspect"}>
                  Inspect Smart Contract(s)
                </SelectItem>
            </SelectContent>
          </Select>
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="My new project"
              className="col-span-3"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </section>
        <DialogFooter className="mt-4">
          <Button onClick={handleCreateClicked}>Create</Button>
        </DialogFooter>
      </SubmitOnEnter>
    </DialogContent>
  );
}
