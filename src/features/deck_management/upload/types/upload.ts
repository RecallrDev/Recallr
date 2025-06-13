export type UploadAnkiDeckProps = {
  onUploadSuccess: () => void;
};

export type UploadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
  onNavigateToStudy: () => void;
};

export type DragDropZoneProps = {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
};

export type BetaWarningProps = {
  className?: string;
}; 