import { useRef, useState } from 'react';
import { validateImage } from '@/lib/security';

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (imageUrl: string) => void;
  index: number;
}

export function ImageUpload({ label, value, onChange, index }: ImageUploadProps) {
  const [preview, setPreview] = useState<string>(value || '');
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');

    // Validar imagen (tipo y tamaño)
    const validation = validateImage(file);
    if (!validation.valid) {
      setError(validation.error || 'Archivo inválido');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Leer el archivo y convertirlo a base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result as string;
      setPreview(imageUrl);
      onChange(imageUrl);
    };
    reader.onerror = () => {
      setError('Error al leer el archivo');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setError('');
    setPreview(url);
    onChange(url);
  };

  const handleRemove = () => {
    setPreview('');
    setError('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="rounded-lg border border-stone-200 p-4">
      <label className="mb-2 block text-sm font-medium text-ink">
        {label}
      </label>

      {/* Preview de la imagen */}
      {preview && (
        <div className="relative mb-3">
          <img
            src={preview}
            alt={`Preview ${index + 1}`}
            className="h-48 w-full rounded-lg border border-stone-200 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23ddd" width="100" height="100"/><text x="50%" y="50%" text-anchor="middle" fill="%23999" font-size="14">Error</text></svg>';
            }}
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute right-2 top-2 rounded-lg bg-red-500 px-3 py-1 text-sm font-medium text-white hover:bg-red-600"
          >
            Eliminar
          </button>
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <div className="mb-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Botones de acción */}
      <div className="space-y-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={handleClick}
          className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-stone-50"
        >
          📁 Seleccionar imagen (máx. 2MB)
        </button>

        <div className="text-center text-xs text-ink-muted">o</div>

        <div>
          <input
            type="text"
            value={preview}
            onChange={handleUrlChange}
            placeholder="Pega una URL de imagen"
            className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-ink focus:outline-none"
          />
          <p className="mt-1 text-xs text-ink-muted">
            URL o ruta del proyecto (ej: /src/assets/images/producto.jpg)
          </p>
        </div>
      </div>
    </div>
  );
}
