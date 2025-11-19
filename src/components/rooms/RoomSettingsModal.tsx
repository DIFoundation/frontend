"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Room } from '@/types/room';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useContract } from '@/hooks/useContract';
import { useToast } from '@/components/ui/use-toast';

type RoomSettingsForm = {
  name: string;
  description: string;
  isPrivate: boolean;
  password?: string;
};

type RoomSettingsModalProps = {
  room: Room;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (updatedRoom: Partial<Room>) => void;
};

export function RoomSettingsModal({ room, isOpen, onClose, onSave }: RoomSettingsModalProps) {
  const { updateRoomSettings } = useContract();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<RoomSettingsForm>({
    defaultValues: {
      name: room.name,
      description: room.description || '',
      isPrivate: room.isPrivate,
    },
  });

  const isPrivate = watch('isPrivate');

  const onSubmit = async (data: RoomSettingsForm) => {
    try {
      setIsLoading(true);
      // Call your contract's updateRoomSettings function
      await updateRoomSettings(room.id, {
        name: data.name,
        description: data.description,
        isPrivate: data.isPrivate,
        password: data.password,
      });
      
      onSave?.({
        ...room,
        ...data,
      });
      
      toast({
        title: 'Success',
        description: 'Room settings updated successfully',
      });
      
      onClose();
    } catch (error) {
      console.error('Error updating room settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to update room settings',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Room Settings</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Room Name</Label>
            <Input
              id="name"
              placeholder="Enter room name"
              {...register('name', { required: 'Room name is required' })}
              disabled={isLoading}
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="What's this room about?"
              {...register('description')}
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="private-room"
              checked={isPrivate}
              onCheckedChange={(checked) => {
                // Update form value
                const event = { target: { name: 'isPrivate', value: checked } };
                // @ts-ignore
                register('isPrivate').onChange(event);
              }}
              disabled={isLoading}
            />
            <Label htmlFor="private-room">
              {isPrivate ? 'Private Room' : 'Public Room'}
            </Label>
          </div>

          {isPrivate && (
            <div>
              <Label htmlFor="password">Update Password (leave blank to keep current)</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter new password"
                {...register('password')}
                disabled={isLoading}
              />
            </div>
          )}

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !isDirty}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
