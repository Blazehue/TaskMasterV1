import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.enum([
    "Design",
    "Development",
    "Marketing",
    "Research",
    "Infrastructure",
  ]),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  upcomingTasks: z
    .array(
      z.object({
        title: z.string().min(1, "Task title is required"),
        priority: z.enum(["low", "medium", "high"]),
        description: z.string().optional(),
        dueDate: z.string().optional(),
      })
    )
    .default([]), // ✅ ensures it’s always an array
});

type ProjectFormData = z.infer<typeof projectSchema>;

export default function ProjectForm() {
  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "Design",
      dueDate: "",
      upcomingTasks: [], // ✅ safe default
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "upcomingTasks",
  });

  const onSubmit = (data: ProjectFormData) => {
    console.log("Form Data:", data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block font-medium">Title</label>
        <input
          {...form.register("title")}
          className="border rounded p-2 w-full"
        />
        {form.formState.errors.title && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.title.message}
          </p>
        )}
      </div>

      <div>
        <label className="block font-medium">Category</label>
        <select
          {...form.register("category")}
          className="border rounded p-2 w-full"
        >
          <option value="Design">Design</option>
          <option value="Development">Development</option>
          <option value="Marketing">Marketing</option>
          <option value="Research">Research</option>
          <option value="Infrastructure">Infrastructure</option>
        </select>
      </div>

      <div>
        <label className="block font-medium">Description</label>
        <textarea
          {...form.register("description")}
          className="border rounded p-2 w-full"
        />
      </div>

      <div>
        <label className="block font-medium">Due Date</label>
        <input
          type="date"
          {...form.register("dueDate")}
          className="border rounded p-2 w-full"
        />
      </div>

      <div>
        <label className="block font-medium">Upcoming Tasks</label>
        {fields.map((field, index) => (
          <div key={field.id} className="border p-3 rounded mb-2 space-y-2">
            <input
              placeholder="Task Title"
              {...form.register(`upcomingTasks.${index}.title`)}
              className="border rounded p-2 w-full"
            />
            <select
              {...form.register(`upcomingTasks.${index}.priority`)}
              className="border rounded p-2 w-full"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <textarea
              placeholder="Description"
              {...form.register(`upcomingTasks.${index}.description`)}
              className="border rounded p-2 w-full"
            />
            <input
              type="date"
              {...form.register(`upcomingTasks.${index}.dueDate`)}
              className="border rounded p-2 w-full"
            />
            <button
              type="button"
              onClick={() => remove(index)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            append({ title: "", priority: "low", description: "", dueDate: "" })
          }
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Task
        </button>
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Submit
      </button>
    </form>
  );
}
