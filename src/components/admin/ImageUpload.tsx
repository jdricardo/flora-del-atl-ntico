import { useRef, useState } from 'react';
import { validateImage } from '@/lib/security';

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (imageUrl: string) => void;
  index: number;
}

/** Lado mayor al que se reduce la foto antes de guardarla. */
const LADO_MAXIMO = 1200;

/**
 * Reduce y recomprime la foto antes de convertirla a base64.
 *
 * El catálogo se guarda entero en el almacenamiento del navegador, que ronda
 * los 5 MB: una foto de celular sin tocar ocupa 2,7 MB en base64 y un par de
 * ellas bastan para llenarlo y que deje de guardarse. Así cada foto baja a
 * unos 150 KB y además el sitio carga más rápido.
 */
function comprimirImagen(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onerror = () => reject(new Error('No se pudo leer el archivo'));
    lector.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('El archivo no es una imagen válida'));
      img.onload = () => {
        const escala = Math.min(1, LADO_MAXIMO / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * escala);
        canvas.height = Math.round(img.height * escala);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('El navegador no permitió procesar la imagen'));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.src = lector.result as string;
    };
    lector.readAsDataURL(file);
  });
}

export function ImageUpload({ label, value, onChange, index }: ImageUploadProps) {
  const [preview, setPreview] = useState<string>(value || '');
  const [error, setError] = useState<string>('');
  const [procesando, setProcesando] = useState(false);
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

    setProcesando(true);
    comprimirImagen(file)
      .then((imageUrl) => {
        setPreview(imageUrl);
        onChange(imageUrl);
      })
      .catch((err: Error) => {
        setError(err.message);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      })
      .finally(() => setProcesando(false));
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
          disabled={procesando}
          className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-stone-50 disabled:opacity-60"
        >
          {procesando ? 'Procesando imagen…' : '📁 Seleccionar imagen (máx. 2MB)'}
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
