import { useState, useRef } from "react";
import { Camera } from "lucide-react";

interface AvatarUploadProps {
  name: string;
  initialImage?: string;
  onUpload?: (file: File) => void;
}

export function AvatarUpload({ name, initialImage, onUpload }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(initialImage || null);
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitials = (n: string) => {
    const parts = n.split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return n.substring(0, 2).toUpperCase();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Por favor, selecione uma imagem válida (JPEG ou PNG).");
        return;
      }
      // Create local preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Notify parent
      if (onUpload) onUpload(file);
    }
  };

  return (
    <div 
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => fileInputRef.current?.click()}
    >
      <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-background shadow-md bg-muted flex items-center justify-center text-3xl font-bold text-muted-foreground relative">
        {preview ? (
          <img 
            src={preview} 
            alt={name} 
            className="h-full w-full object-cover transition-opacity duration-300" 
            onError={(e) => {
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1e40af&color=fff&size=128`;
            }}
          />
        ) : (
          getInitials(name)
        )}

        {/* Hover Overlay */}
        <div className={`absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <Camera className="h-6 w-6 mb-1" />
          <span className="text-xs font-medium">Alterar</span>
        </div>
      </div>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/jpeg, image/png, image/webp" 
        className="hidden" 
      />
    </div>
  );
}
