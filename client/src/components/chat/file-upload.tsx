import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Paperclip, X, FileIcon, ImageIcon } from "lucide-react";

export interface FileAttachment {
  name: string;
  type: string;
  data: string; // base64 encoded
  size: number;
}

interface FileUploadProps {
  onFilesSelected: (files: FileAttachment[]) => void;
  attachments: FileAttachment[];
  onRemoveAttachment: (index: number) => void;
  disabled?: boolean;
}

export function FileUpload({ onFilesSelected, attachments, onRemoveAttachment, disabled }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length === 0) return;

    // Check file size (max 10MB per file)
    const maxSize = 10 * 1024 * 1024;
    const oversizedFiles = files.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      toast({
        title: "File too large",
        description: `Files must be smaller than 10MB. ${oversizedFiles.length} file(s) were skipped.`,
        variant: "destructive",
      });
    }

    const validFiles = files.filter(file => file.size <= maxSize);
    
    if (validFiles.length === 0) return;

    try {
      const fileAttachments: FileAttachment[] = [];
      
      for (const file of validFiles) {
        const reader = new FileReader();
        const fileData = await new Promise<string>((resolve, reject) => {
          reader.onload = () => {
            const result = reader.result as string;
            // Remove the data URL prefix to get just the base64 data
            const base64Data = result.split(',')[1];
            resolve(base64Data);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        fileAttachments.push({
          name: file.name,
          type: file.type,
          data: fileData,
          size: file.size,
        });
      }

      onFilesSelected(fileAttachments);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      toast({
        title: "Files attached",
        description: `${fileAttachments.length} file(s) ready to send.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process files. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <ImageIcon className="h-4 w-4" />;
    }
    return <FileIcon className="h-4 w-4" />;
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept="image/*,.pdf,.doc,.docx,.txt,.json,.csv"
        className="hidden"
        disabled={disabled}
      />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={handleFileSelect}
        disabled={disabled}
        className="p-2 hover:bg-muted rounded-lg transition-colors"
        data-testid="button-attach-file"
      >
        <Paperclip className="text-muted-foreground" />
      </Button>

      {/* Attached Files Display */}
      {attachments.length > 0 && (
        <div className="mt-2 space-y-2" data-testid="attached-files">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2 text-sm"
              data-testid={`attachment-${index}`}
            >
              <div className="flex items-center space-x-2">
                {getFileIcon(file.type)}
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveAttachment(index)}
                className="p-1 h-auto text-muted-foreground hover:text-destructive"
                data-testid={`remove-attachment-${index}`}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}