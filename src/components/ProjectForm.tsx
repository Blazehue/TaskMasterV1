import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.enum(["Work", "Personal", "Other"]),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  tasks: z
    .array(z.object({ name: z.string().min(1, "Task name is required") }))
    .min(1, "At least one task is required"),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
  onSubmit?: (data: ProjectFormData) => void;
}

export default function ProjectForm({ isOpen, onClose, onSuccess, onSubmit }: ProjectFormProps) {
  const { register, handleSubmit, control, formState: { errors }, reset } =
    useForm<ProjectFormData>({ resolver: zodResolver(projectSchema) });

  const { fields, append, remove } = useFieldArray({ control, name: "tasks" });

  const handleFormSubmit = async (data: ProjectFormData) => {
    try {
      if (onSubmit) {
        await onSubmit(data);
      }
      if (onSuccess) {
        onSuccess();
      }
      reset();
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Create New Project</h2>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          )}
        </div>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
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
              {...register(`tasks.${index}.name`)}
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
      </div>
    </div>
  );
}
