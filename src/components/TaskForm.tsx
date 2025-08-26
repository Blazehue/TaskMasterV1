"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

interface Project {
  id: number;
  title: string;
}

interface TaskFormData {
  title: string;
  description?: string;
  projectId: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'doing' | 'done';
  xpReward: number;
  dueDate: string;
}

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ isOpen, onClose, onSuccess }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [submissionState, setSubmissionState] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const form = useForm<TaskFormData>({
    defaultValues: {
      title: '',
      description: '',
      projectId: '',
      priority: 'medium',
      status: 'todo',
      xpReward: 100,
      dueDate: '',
    },
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (!response.ok) throw new Error('Failed to fetch projects');
        const projectsData = await response.json();
        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    if (isOpen) {
      fetchProjects();
    }
  }, [isOpen]);

  const handleClose = () => {
    form.reset();
    setSubmissionState('idle');
    setErrorMessage('');
    onClose();
  };

  const onSubmit = async (data: TaskFormData) => {
    setIsLoading(true);
    setSubmissionState('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          projectId: data.projectId ? parseInt(data.projectId) : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create task');
      }

      setSubmissionState('success');
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 1500);
    } catch (error) {
      setSubmissionState('error');
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const getSubmissionContent = () => {
    if (submissionState === 'success') {
      return (
        <div className="flex items-center justify-center space-x-2 text-green-500">
          <CheckCircle className="h-5 w-5" />
          <span>Task created successfully!</span>
        </div>
      );
    }

    if (submissionState === 'error') {
      return (
        <div className="flex items-center justify-center space-x-2 text-red-500">
          <XCircle className="h-5 w-5" />
          <span>{errorMessage}</span>
        </div>
      );
    }

    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border border rounded-none">
        <DialogHeader>
          <DialogTitle className="text-foreground font-semibold">Create New Task</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              rules={{ required: 'Title is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Title *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter task title"
                      className="bg-input border-border text-foreground placeholder:text-muted-foreground rounded-none"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter task description (optional)"
                      className="bg-input border-border text-foreground placeholder:text-muted-foreground min-h-[80px] rounded-none resize-none"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Project</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                    <FormControl>
                      <SelectTrigger className="bg-input border-border text-foreground rounded-none">
                        <SelectValue placeholder="Select a project (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-popover border-border rounded-none">
                      <SelectItem value="" className="text-foreground">No Project</SelectItem>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id.toString()} className="text-foreground">
                          {project.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Priority</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                      <FormControl>
                        <SelectTrigger className="bg-input border-border text-foreground rounded-none">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-popover border-border rounded-none">
                        <SelectItem value="low" className="text-foreground">Low</SelectItem>
                        <SelectItem value="medium" className="text-foreground">Medium</SelectItem>
                        <SelectItem value="high" className="text-foreground">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                      <FormControl>
                        <SelectTrigger className="bg-input border-border text-foreground rounded-none">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-popover border-border rounded-none">
                        <SelectItem value="todo" className="text-foreground">To Do</SelectItem>
                        <SelectItem value="doing" className="text-foreground">Doing</SelectItem>
                        <SelectItem value="done" className="text-foreground">Done</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="xpReward"
              rules={{ 
                required: 'XP Reward is required',
                min: { value: 1, message: 'XP Reward must be at least 1' }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">XP Reward</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="1"
                      className="bg-input border-border text-foreground rounded-none"
                      disabled={isLoading}
                      onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              rules={{ required: 'Due date is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Due Date *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="date"
                      className="bg-input border-border text-foreground rounded-none"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {getSubmissionContent()}

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                className="bg-secondary border-border text-secondary-foreground hover:bg-accent rounded-none"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || submissionState === 'success'}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Task'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};