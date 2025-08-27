"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, CheckCircle2, AlertCircle, Plus, Trash2, GripVertical } from "lucide-react";
import { useFieldArray } from "react-hook-form";

interface ProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const upcomingTaskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
});

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.enum(["Design", "Development", "Marketing", "Research", "Infrastructure"]),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  upcomingTasks: z.array(
    z.object({
      title: z.string().min(1, "Task title is required"),
      priority: z.enum(["low", "medium", "high"]),
      description: z.string().optional(),
      dueDate: z.string().optional(),
    })
  ).default([]),  // ✅ required but defaults to empty array
});

type ProjectFormData = z.infer<typeof projectSchema>;

const categories = [
  "Design",
  "Development", 
  "Marketing",
  "Research",
  "Infrastructure"
] as const;

export const ProjectForm = ({ isOpen, onClose, onSuccess }: ProjectFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<ProjectFormData>({
  resolver: zodResolver(projectSchema),
  defaultValues: {
    title: "",
    description: "",
    category: "Design",
    dueDate: "",
    upcomingTasks: [],   // ✅ must be added
  },
});

  const onSubmit = async (data: ProjectFormData) => {
    setIsLoading(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
          upcomingTasks: data.upcomingTasks?.map(task => ({
            ...task,
            dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : null,
          })) || [],
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create project");
      }

      setSubmitStatus("success");
      setTimeout(() => {
        handleClose();
        onSuccess();
      }, 1500);
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    form.reset();
    setSubmitStatus("idle");
    setErrorMessage("");
    onClose();
  };

  const addUpcomingTask = () => {
    append({
      title: "",
      description: "",
      dueDate: "",
      priority: "medium",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border border-2 rounded-none max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground text-xl font-black font-mono uppercase tracking-wide">
            CREATE NEW PROJECT
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-medium">
                    Title *
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter project title"
                      className="rounded-none border-2 border-border bg-input text-foreground"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage className="text-destructive text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-medium">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter project description"
                      rows={3}
                      className="rounded-none border-2 border-border bg-input text-foreground resize-none"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage className="text-destructive text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-medium">
                    Category
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger className="rounded-none border-2 border-border bg-input text-foreground">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-none border-2 border-border bg-popover">
                      {categories.map((category) => (
                        <SelectItem
                          key={category}
                          value={category}
                          className="rounded-none text-popover-foreground hover:bg-accent hover:text-accent-foreground"
                        >
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-destructive text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-medium">
                    Due Date
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="date"
                      className="rounded-none border-2 border-border bg-input text-foreground"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage className="text-destructive text-sm" />
                </FormItem>
              )}
            />

            {/* Upcoming Tasks Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel className="text-foreground font-black font-mono uppercase tracking-wide text-sm">
                  UPCOMING TASKS
                </FormLabel>
                <Button
                  type="button"
                  onClick={addUpcomingTask}
                  variant="outline"
                  size="sm"
                  disabled={isLoading}
                  className="rounded-none border-2 border-black bg-white text-black hover:bg-black hover:text-white font-mono font-bold uppercase tracking-wide text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  ADD TASK
                </Button>
              </div>
              
              {fields.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 text-gray-500 font-mono text-sm uppercase tracking-wide">
                  NO UPCOMING TASKS YET
                </div>
              )}
              
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {fields.map((field, index) => (
                  <div key={field.id} className="border-2 border-black bg-gray-50 p-4 relative group">
                    <div className="absolute top-2 right-2">
                      <Button
                        type="button"
                        onClick={() => remove(index)}
                        variant="outline"
                        size="sm"
                        disabled={isLoading}
                        className="h-6 w-6 p-0 rounded-none border-2 border-red-500 bg-white text-red-500 hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                      <FormField
                        control={form.control}
                        name={`upcomingTasks.${index}.title`}
                        render={({ field: taskField }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-mono uppercase tracking-wide font-bold">
                              TASK TITLE *
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...taskField}
                                placeholder="Enter task title"
                                className="rounded-none border-2 border-black bg-white text-black font-mono text-sm"
                                disabled={isLoading}
                              />
                            </FormControl>
                            <FormMessage className="text-destructive text-xs" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`upcomingTasks.${index}.priority`}
                        render={({ field: priorityField }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-mono uppercase tracking-wide font-bold">
                              PRIORITY
                            </FormLabel>
                            <Select
                              onValueChange={priorityField.onChange}
                              defaultValue={priorityField.value}
                              disabled={isLoading}
                            >
                              <FormControl>
                                <SelectTrigger className="rounded-none border-2 border-black bg-white text-black font-mono text-sm">
                                  <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="rounded-none border-2 border-black bg-white">
                                <SelectItem value="low" className="rounded-none font-mono text-sm">LOW</SelectItem>
                                <SelectItem value="medium" className="rounded-none font-mono text-sm">MEDIUM</SelectItem>
                                <SelectItem value="high" className="rounded-none font-mono text-sm">HIGH</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-destructive text-xs" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`upcomingTasks.${index}.description`}
                        render={({ field: descField }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel className="text-xs font-mono uppercase tracking-wide font-bold">
                              DESCRIPTION
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                {...descField}
                                placeholder="Enter task description"
                                rows={2}
                                className="rounded-none border-2 border-black bg-white text-black font-mono text-sm resize-none"
                                disabled={isLoading}
                              />
                            </FormControl>
                            <FormMessage className="text-destructive text-xs" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`upcomingTasks.${index}.dueDate`}
                        render={({ field: dueDateField }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-mono uppercase tracking-wide font-bold">
                              DUE DATE
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...dueDateField}
                                type="date"
                                className="rounded-none border-2 border-black bg-white text-black font-mono text-sm"
                                disabled={isLoading}
                              />
                            </FormControl>
                            <FormMessage className="text-destructive text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {submitStatus === "error" && (
              <div className="flex items-center gap-2 p-3 border-2 border-destructive bg-destructive/10">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span className="text-destructive text-sm">{errorMessage}</span>
              </div>
            )}

            {submitStatus === "success" && (
              <div className="flex items-center gap-2 p-3 border-2 border-green-600 bg-green-600/10">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-green-600 text-sm">Project created successfully!</span>
              </div>
            )}

            <div className="flex gap-3 pt-6 border-t-2 border-gray-200 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1 rounded-none border-2 border-black bg-white text-black hover:bg-gray-100 font-mono font-bold uppercase tracking-wide"
              >
                CANCEL
              </Button>
              <Button
                type="submit"
                disabled={isLoading || submitStatus === "success"}
                className="flex-1 rounded-none bg-black text-white hover:bg-gray-800 disabled:opacity-50 font-mono font-bold uppercase tracking-wide"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    CREATING...
                  </>
                ) : submitStatus === "success" ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    CREATED
                  </>
                ) : (
                  "CREATE PROJECT"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};