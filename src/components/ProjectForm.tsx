import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.enum(["Work", "Personal", "Other"], {
    required_error: "Category is required",
  }),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  tasks: z
    .array(z.object({ name: z.string().min(1, "Task name is required") }))
    .min(1, "At least one task is required"),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  onSubmit: (data: ProjectFormData) => void;
}

export default function ProjectForm({ onSubmit }: ProjectFormProps) {
  const { register, handleSubmit, control, formState: { errors } } =
    useForm<ProjectFormData>({ resolver: zodResolver(projectSchema) });

  const { fields, append, remove } = useFieldArray({ control, name: "tasks" });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input {...register("title")} className="border rounded p-2 w-full" />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Category</label>
        <select {...register("category")} className="border rounded p-2 w-full">
          <option value="">Select category</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Other">Other</option>
        </select>
        {errors.category && <p className="text-red-500">{errors.category.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea {...register("description")} className="border rounded p-2 w-full" />
      </div>

      <div>
        <label className="block text-sm font-medium">Due Date</label>
        <input type="date" {...register("dueDate")} className="border rounded p-2 w-full" />
      </div>

      <div>
        <label className="block text-sm font-medium">Tasks</label>
        {fields.map((field, index) => (
          <div key={field.id} className="flex space-x-2 mb-2">
            <input
              {...register(	asks..name)}
              className="border rounded p-2 flex-1"
              placeholder="Task name"
            />
            <button type="button" onClick={() => remove(index)} className="bg-red-500 text-white px-2 rounded">
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={() => append({ name: "" })} className="bg-blue-500 text-white px-3 py-1 rounded">
          Add Task
        </button>
        {errors.tasks && <p className="text-red-500">{errors.tasks.message}</p>}
      </div>

      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
        Create Project
      </button>
    </form>
  );
}
