"use client";

import { Room } from '@/types/room';
import { Button } from '@/components/ui/button';
import { Lock, Users, MessageSquare, Clock, TrendingUp } from 'lucide-react';
import { useContract } from '@/hooks/useContract';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

type RoomListItemProps = {
  room: Room;
  onJoin?: (roomId: number) => void;
  onLeave?: (roomId: number) => void;
};

export function RoomListItem({ room, onJoin, onLeave }: RoomListItemProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { joinRoom, leaveRoom } = useContract();
  const [isLoading, setIsLoading] = useState(false);

  const handleJoin = async () => {
    try {
      setIsLoading(true);
      await joinRoom(room.id);
      onJoin?.(room.id);
      router.push(`/rooms/${room.id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to join room',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeave = async () => {
    try {
      setIsLoading(true);
      await leaveRoom(room.id);
      onLeave?.(room.id);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to leave room',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-lg">{room.name}</h3>
            {room.isPrivate ? (
              <Lock className="h-4 w-4 text-amber-500" />
            ) : (
              <Globe className="h-4 w-4 text-blue-500" />
            )}
            {room.trending && (
              <div className="flex items-center text-amber-500">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-xs">Trending</span>
              </div>
            )}
          </div>
          
          {room.description && (
            <p className="text-sm text-muted-foreground">{room.description}</p>
          )}
          
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>{room.memberCount} members</span>
            </div>
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-1" />
              <span>{room.messageCount} messages</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>Active {formatDistanceToNow(new Date(room.lastActive))} ago</span>
            </div>
          </div>
        </div>
        
        <div className="flex-shrink-0">
          {room.isJoined ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLeave}
              disabled={isLoading}
            >
              Leave
            </Button>
          ) : (
            <Button 
              size="sm" 
              onClick={handleJoin}
              disabled={isLoading}
            >
              Join
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
