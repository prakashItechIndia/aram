
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Edit,
  Eye,
  EyeOff,
  Folder,
  Search,
  Grid3x3,
  List,
  Download,
  X,
  FolderPlus,
  Plus,
} from 'lucide-react';
import { toast } from 'sonner';
import { useApi, getApiBaseUrl } from '../context/ApiContext';

interface GalleryImage {
  id: string;
  title: string;
  caption: string;
  altText: string;
  photographer: string;
  tags: string[];
  album: string;
  visibility: 'Public' | 'Private';
  uploadedOn: string;
  uploadedBy: string;
  thumbnail: string;
  fileSize: string;
}

interface Album {
  id: string;
  name: string;
  coverImage: string;
  imageCount: number;
  visibility: 'Public' | 'Private';
  createdOn: string;
}

function mapApiToImage(row: Record<string, unknown>): GalleryImage {
  const tagsJson = row.tagsJson as string | undefined;
  let tags: string[] = [];
  if (tagsJson) {
    try {
      const parsed = JSON.parse(tagsJson);
      tags = Array.isArray(parsed) ? parsed : [];
    } catch {
      /* ignore */
    }
  }
  const createdAt = row.createdAt as string | undefined;
  const dateStr = createdAt ? new Date(createdAt).toISOString().slice(0, 10) : '';
  const albumId = row.albumId;
  return {
    id: String(row.id ?? ''),
    title: String(row.title ?? ''),
    caption: String(row.caption ?? ''),
    altText: String(row.altText ?? ''),
    photographer: String(row.photographer ?? ''),
    tags,
    album: albumId != null ? String(albumId) : '',
    visibility: (row.visibility as GalleryImage['visibility']) ?? 'Public',
    uploadedOn: dateStr,
    uploadedBy: String(row.uploadedBy ?? ''),
    thumbnail: String(row.thumbnailPath ?? row.imagePath ?? ''),
    fileSize: String(row.fileSize ?? ''),
  };
}

function mapApiToAlbum(row: Record<string, unknown>): Album {
  const createdAt = row.createdAt as string | undefined;
  const dateStr = createdAt ? new Date(createdAt).toISOString().slice(0, 10) : '';
  return {
    id: String(row.id ?? ''),
    name: String(row.name ?? ''),
    coverImage: String(row.coverImageUrl ?? ''),
    imageCount: Number(row.imageCount ?? 0),
    visibility: (row.visibility as Album['visibility']) ?? 'Public',
    createdOn: dateStr,
  };
}

const TAGS = ['Education', 'Healthcare', 'Community', 'Events', '2026', '2025', 'Chennai', 'Mumbai', 'Karnataka'];

function galleryAssetUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const base = getApiBaseUrl();
  const origin = base.replace(/\/api\/?$/, '');
  return `${origin}${path.startsWith('/') ? path : `/${path}`}`;
}

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 B';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function GalleryScreen() {
  const { api, apiFetch, user, logout } = useApi();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Filter state - must be declared before fetchGallery
  const [filterAlbum, setFilterAlbum] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [filterVisibility, setFilterVisibility] = useState('');
  const [filterSearch, setFilterSearch] = useState('');
  const [searchText, setSearchText] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilterSearch(searchText);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchText]);

  const fetchAlbums = useCallback(async () => {
    try {
      const albumsApi = (api as { galleryAlbumsApi?: { galleryAlbumsControllerFindAll: () => Promise<unknown> } }).galleryAlbumsApi;
      if (albumsApi?.galleryAlbumsControllerFindAll) {
        const albRes = await albumsApi.galleryAlbumsControllerFindAll();
        const albData = (albRes as { data?: unknown }).data;
        const albList = Array.isArray(albData) ? albData : [];
        setAlbums(albList.map((row: Record<string, unknown>) => mapApiToAlbum(row)));
      } else {
        setAlbums([]);
      }
    } catch (e: unknown) {
      console.error('Failed to fetch albums:', e);
      setAlbums([]);
    }
  }, [api]);

  const fetchGallery = useCallback(async () => {
    try {
      if (isInitialLoad) {
        setLoading(true);
      } else {
        setFilterLoading(true);
      }
      setError(null);

      // Build query params for images
      const params = new URLSearchParams();
      if (filterAlbum) params.append('albumId', filterAlbum);
      if (filterTag) params.append('tag', filterTag);
      if (filterVisibility) params.append('visibility', filterVisibility);
      if (filterSearch) params.append('search', filterSearch);

      const queryString = params.toString();
      const url = `/website/gallery${queryString ? `?${queryString}` : ''}`;

      const imgRes = await apiFetch(url);
      if (!imgRes.ok) throw new Error('Failed to fetch gallery');

      const imgList = await imgRes.json();
      setImages(Array.isArray(imgList) ? imgList.map((row: Record<string, unknown>) => mapApiToImage(row)) : []);

      // Fetch albums only on initial load
      if (isInitialLoad) {
        await fetchAlbums();
        setIsInitialLoad(false);
      }
    } catch (e: unknown) {
      setError((e as Error)?.message ?? 'Failed to load gallery');
      setImages([]);
      if (isInitialLoad) setAlbums([]);
    } finally {
      setLoading(false);
      setFilterLoading(false);
    }
  }, [apiFetch, filterAlbum, filterTag, filterVisibility, filterSearch, isInitialLoad, fetchAlbums]);

  const totalStorage = images.reduce((acc, img) => acc + (Number(img.fileSize) || 0), 0);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showUpload, setShowUpload] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [showAlbums, setShowAlbums] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState<GalleryImage | null>(null);
  const [showNewAlbum, setShowNewAlbum] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [existingAlbumImages, setExistingAlbumImages] = useState<GalleryImage[]>([]);
  const [loadingAlbumImages, setLoadingAlbumImages] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [newAlbumDescription, setNewAlbumDescription] = useState('');
  const [newAlbumVisibility, setNewAlbumVisibility] = useState<'Public' | 'Private'>('Public');
  const [newAlbumCover, setNewAlbumCover] = useState<File | null>(null);
  const [newAlbumImages, setNewAlbumImages] = useState<File[]>([]);
  const [showBulkTag, setShowBulkTag] = useState(false);
  const [showBulkVisibility, setShowBulkVisibility] = useState(false);
  const [isMovingToAlbum, setIsMovingToAlbum] = useState(false);
  const [editorHighlight, setEditorHighlight] = useState<'tags' | 'visibility' | null>(null);
  const [bulkTags, setBulkTags] = useState<string[]>([]);
  const [bulkVisibility, setBulkVisibility] = useState<'Public' | 'Private'>('Public');

  // Upload modal state
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadAlbumId, setUploadAlbumId] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);

  // Replace image in editor
  const [replacementFile, setReplacementFile] = useState<File | null>(null);
  const [replacementPreviewUrl, setReplacementPreviewUrl] = useState<string | null>(null);

  // Editor state
  const [imageTitle, setImageTitle] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [imageAltText, setImageAltText] = useState('');
  const [imagePhotographer, setImagePhotographer] = useState('');
  const [imageTags, setImageTags] = useState<string[]>([]);
  const [imageAlbum, setImageAlbum] = useState('');
  const [imageVisibility, setImageVisibility] = useState<'Public' | 'Private'>('Public');

  const handleEdit = (image: GalleryImage, highlight: 'tags' | 'visibility' | null = null) => {
    setSelectedImage(image);
    setImageTitle(image.title);
    setImageCaption(image.caption);
    setImageAltText(image.altText);
    setImagePhotographer(image.photographer);
    setImageTags(image.tags);
    setImageAlbum(image.album);
    setImageVisibility(image.visibility);
    setEditorHighlight(highlight);
    if (replacementPreviewUrl) URL.revokeObjectURL(replacementPreviewUrl);
    setReplacementFile(null);
    setReplacementPreviewUrl(null);
    setShowEditor(true);
  };

  const handleReplaceImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      return;
    }
    if (file.size > 10 * 1024 * 1024) return;
    if (replacementPreviewUrl) URL.revokeObjectURL(replacementPreviewUrl);
    setReplacementFile(file);
    setReplacementPreviewUrl(URL.createObjectURL(file));
  };

  const clearReplacement = () => {
    if (replacementPreviewUrl) URL.revokeObjectURL(replacementPreviewUrl);
    setReplacementFile(null);
    setReplacementPreviewUrl(null);
  };

  const handleSave = async () => {
    if (!selectedImage) return;
    const token = user?.accessToken;
    try {
      setSaving(true);
      let imagePath: string | undefined;
      let thumbnailPath: string | undefined;
      if (replacementFile && token) {
        const baseUrl = getApiBaseUrl();
        const formData = new FormData();
        formData.append('file', replacementFile);
        const uploadRes = await fetch(`${baseUrl}/website/gallery/upload`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (!uploadRes.ok) {
          if (uploadRes.status === 401) {
            logout();
            throw new Error('Session expired. Please log in again.');
          }
          throw new Error(await uploadRes.text() || 'Upload failed');
        }
        const data = (await uploadRes.json()) as { imagePath: string; thumbnailPath?: string };
        imagePath = data.imagePath;
        thumbnailPath = data.thumbnailPath ?? data.imagePath;
      }
      const body = JSON.stringify({
        title: imageTitle,
        caption: imageCaption || undefined,
        altText: imageAltText || undefined,
        photographer: imagePhotographer || undefined,
        tagsJson: JSON.stringify(imageTags),
        visibility: imageVisibility,
        ...(imageAlbum ? { albumId: Number(imageAlbum) } : {}),
        ...(imagePath !== undefined ? { imagePath } : {}),
        ...(thumbnailPath !== undefined ? { thumbnailPath } : {}),
      });
      const res = await apiFetch(`/website/gallery/${selectedImage.id}`, { method: 'PATCH', body });
      if (!res.ok) throw new Error(await res.text());
      if (replacementPreviewUrl) URL.revokeObjectURL(replacementPreviewUrl);
      setReplacementFile(null);
      setReplacementPreviewUrl(null);
      setShowEditor(false);
      await fetchGallery();
    } catch (e: unknown) {
      setError((e as Error)?.message ?? 'Failed to save image');
    } finally {
      setSaving(false);
    }
  };

  const handleBulkDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      setSaving(true);
      for (const id of selectedImages) {
        const res = await apiFetch(`/website/gallery/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error(await res.text());
      }
      setShowDeleteModal(false);
      setDeleteReason('');
      setSelectedImages([]);
      toast.success('Images deleted successfully');
      await fetchGallery();
    } catch (e: unknown) {
      toast.error((e as Error)?.message ?? 'Failed to delete images');
    } finally {
      setSaving(false);
    }
  };

  const handleBulkMove = async (albumId: string | null) => {
    try {
      setSaving(true);
      for (const id of selectedImages) {
        const res = await apiFetch(`/website/gallery/${id}`, {
          method: 'PATCH',
          body: JSON.stringify({ albumId: albumId ? Number(albumId) : null })
        });
        if (!res.ok) throw new Error(await res.text());
      }
      setSelectedImages([]);
      setIsMovingToAlbum(false);
      setShowAlbums(false);
      toast.success('Images moved successfully');
      await fetchGallery();
      await fetchAlbums();
    } catch (e: unknown) {
      toast.error((e as Error)?.message ?? 'Failed to move images');
    } finally {
      setSaving(false);
    }
  };

  const handleBulkTagUpdate = async (tags: string[]) => {
    try {
      setSaving(true);
      for (const id of selectedImages) {
        const img = images.find((i: GalleryImage) => i.id === id);
        if (!img) continue;
        const newTags = Array.from(new Set([...img.tags, ...tags]));
        const res = await apiFetch(`/website/gallery/${id}`, {
          method: 'PATCH',
          body: JSON.stringify({ tagsJson: JSON.stringify(newTags) })
        });
        if (!res.ok) throw new Error(await res.text());
      }
      setSelectedImages([]);
      setShowBulkTag(false);
      toast.success('Tags applied successfully');
      await fetchGallery();
    } catch (e: unknown) {
      toast.error((e as Error)?.message ?? 'Failed to apply tags');
    } finally {
      setSaving(false);
    }
  };

  const handleBulkVisibilityUpdate = async (visibility: 'Public' | 'Private') => {
    try {
      setSaving(true);
      for (const id of selectedImages) {
        const res = await apiFetch(`/website/gallery/${id}`, {
          method: 'PATCH',
          body: JSON.stringify({ visibility })
        });
        if (!res.ok) throw new Error(await res.text());
      }
      setSelectedImages([]);
      setShowBulkVisibility(false);
      toast.success(`Visibility set to ${visibility} successfully`);
      await fetchGallery();
    } catch (e: unknown) {
      toast.error((e as Error)?.message ?? 'Failed to update visibility');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateAlbum = async () => {
    if (!newAlbumName.trim()) {
      toast.error('Album name is required');
      return;
    }
    try {
      setSaving(true);
      let albumId = '';

      if (editingAlbum) {
        // Update existing album
        const res = await apiFetch(`/website/gallery/albums/${editingAlbum.id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            name: newAlbumName,
            visibility: newAlbumVisibility,
            // Description is not in DTO/Model yet based on provided files, but was in UI state
            // If description is needed, backend model needs update. 
            // For now sending it if API ignores it, or omit if strictly validated. 
            // Assuming it might be used later or ignored.
          })
        });
        if (!res.ok) throw new Error(await res.text());
        const updated = await res.json();
        albumId = updated.id;
        toast.success('Album updated successfully');
      } else {
        // Create new album
        const res = await apiFetch('/website/gallery/albums', {
          method: 'POST',
          body: JSON.stringify({
            name: newAlbumName,
            visibility: newAlbumVisibility,
          })
        });
        if (!res.ok) throw new Error(await res.text());
        const album = await res.json();
        albumId = album.id;
        toast.success('Album created successfully');
      }

      if (newAlbumCover) {
        const formData = new FormData();
        formData.append('file', newAlbumCover);
        const coverRes = await apiFetch(`/website/gallery/albums/${albumId}/cover`, {
          method: 'POST',
          body: formData
        });
        if (!coverRes.ok) throw new Error(await coverRes.text());
      }

      if (newAlbumImages.length > 0) {
        for (const file of newAlbumImages) {
          const formData = new FormData();
          formData.append('file', file);
          const uploadRes = await apiFetch('/website/gallery/upload', {
            method: 'POST',
            body: formData
          });
          if (!uploadRes.ok) throw new Error(await uploadRes.text());
          const uploadData = await uploadRes.json();

          const createRes = await apiFetch('/website/gallery', {
            method: 'POST',
            body: JSON.stringify({
              title: file.name.split('.')[0],
              imagePath: uploadData.imagePath,
              thumbnailPath: uploadData.thumbnailPath,
              fileSize: uploadData.fileSize,
              albumId: Number(albumId),
              visibility: newAlbumVisibility,
              altText: '',
              description: newAlbumDescription // using album description as default or empty
            })
          });
          if (!createRes.ok) throw new Error(await createRes.text());
        }
      }

      if (isMovingToAlbum && selectedImages.length > 0) {
        for (const id of selectedImages) {
          const moveRes = await apiFetch(`/website/gallery/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ albumId: Number(albumId) })
          });
          if (!moveRes.ok) throw new Error(await moveRes.text());
        }
      }

      setShowNewAlbum(false);
      setEditingAlbum(null);
      setNewAlbumName('');
      setNewAlbumDescription('');
      setNewAlbumCover(null);
      setNewAlbumImages([]);
      setSelectedImages([]);
      setIsMovingToAlbum(false);
      setShowAlbums(false);
      await fetchGallery();
      await fetchAlbums();
    } catch (e: unknown) {
      toast.error((e as Error)?.message ?? 'Failed to save album');
    } finally {
      setSaving(false);
    }
  };

  const openEditAlbum = async (album: Album) => {
    setEditingAlbum(album);
    setNewAlbumName(album.name);
    setNewAlbumVisibility(album.visibility);
    setNewAlbumDescription('');
    setShowNewAlbum(true);

    setLoadingAlbumImages(true);
    try {
      const res = await apiFetch(`/website/gallery?albumId=${album.id}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setExistingAlbumImages(data.map((row: any) => mapApiToImage(row)));
        } else {
          setExistingAlbumImages([]);
        }
      } else {
        throw new Error('Failed to fetch images');
      }
    } catch (error) {
      console.error('Failed to load album images', error);
      toast.error('Failed to load existing images');
    } finally {
      setLoadingAlbumImages(false);
    }
  };

  const handleRemoveFromAlbum = async (imageId: string) => {
    try {
      const res = await apiFetch(`/website/gallery/${imageId}`, {
        method: 'PATCH',
        body: JSON.stringify({ albumId: null })
      });
      if (!res.ok) throw new Error(await res.text());

      setExistingAlbumImages(prev => prev.filter(img => img.id !== imageId));
      toast.success('Image removed from album');
      await fetchAlbums();
    } catch (e: unknown) {
      toast.error((e as Error)?.message ?? 'Failed to remove image from album');
    }
  };

  const toggleImageSelection = (id: string) => {
    setSelectedImages((prev: string[]) =>
      prev.includes(id) ? prev.filter((imgId: string) => imgId !== id) : [...prev, id]
    );
  };

  const handlePreview = (image: GalleryImage) => {
    setPreviewImage(image);
    setShowPreview(true);
  };

  const resetFilters = () => {
    setFilterAlbum('');
    setFilterTag('');
    setFilterVisibility('');
    setFilterSearch('');
    setSearchText('');
  };

  const handleDownload = (image: GalleryImage) => {
    try {
      const baseUrl = getApiBaseUrl();
      const downloadUrl = `${baseUrl}/website/gallery/${image.id}/download`;
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = image.title || 'image';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e: unknown) {
      setError((e as Error)?.message ?? 'Failed to download image');
    }
  };

  const handleUploadFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const imageFiles = files.filter(
      (f) => f.type === 'image/jpeg' || f.type === 'image/png' || f.type === 'image/webp'
    );
    setUploadFiles((prev) => [...prev, ...imageFiles]);
    e.target.value = '';
  };

  const removeUploadFile = (index: number) => {
    setUploadFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadProcess = async () => {
    if (uploadFiles.length === 0) {
      setUploadError('Select at least one image');
      return;
    }
    const token = user?.accessToken;
    if (!token) {
      setUploadError('Not logged in');
      return;
    }
    const baseUrl = getApiBaseUrl();
    setUploading(true);
    setUploadError(null);
    try {
      for (const file of uploadFiles) {
        const formData = new FormData();
        formData.append('file', file);
        const uploadRes = await fetch(`${baseUrl}/website/gallery/upload`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (!uploadRes.ok) {
          if (uploadRes.status === 401) {
            logout();
            setUploadError('Session expired. Please log in again.');
            setUploading(false);
            return;
          }
          const errText = await uploadRes.text();
          throw new Error(errText || `Upload failed for ${file.name}`);
        }
        const { imagePath, thumbnailPath, fileSize } = (await uploadRes.json()) as {
          imagePath: string;
          thumbnailPath?: string;
          fileSize?: string;
        };
        const title = file.name.replace(/\.[^.]+$/, '') || file.name;
        const createRes = await apiFetch('/website/gallery', {
          method: 'POST',
          body: JSON.stringify({
            title,
            imagePath,
            thumbnailPath: thumbnailPath ?? imagePath,
            visibility: 'Public',
            fileSize,
            ...(uploadAlbumId ? { albumId: Number(uploadAlbumId) } : {}),
          }),
        });
        if (!createRes.ok) {
          if (createRes.status === 401) {
            logout();
            setUploadError('Session expired. Please log in again.');
            setUploading(false);
            return;
          }
          throw new Error(await createRes.text());
        }
      }
      setUploadFiles([]);
      setShowUpload(false);
      setUploadAlbumId('');
      await fetchGallery();
    } catch (e: unknown) {
      setUploadError((e as Error)?.message ?? 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col bg-[#F8F8F8]">
      {/* Header */}
      <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[24px] mb-[24px]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[20px] leading-[28px] font-semibold text-[#0D0D0D]">
              Gallery Management
            </h1>
            <p className="text-[13px] leading-[18px] text-[#6E6E6E] mt-1">
              Manage images and albums for the public gallery
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAlbums(true)}
              className="h-[44px] px-[20px] rounded-full border border-[#DBDBDB] bg-white hover:bg-[#F3F3F3] transition-colors flex items-center gap-2 text-[14px] font-medium text-[#3D3D3D]"
            >
              <Folder className="w-4 h-4" />
              Albums
            </button>

            <button
              onClick={() => setShowUpload(true)}
              className="h-[44px] px-[20px] rounded-full bg-[#F36A4F] hover:bg-[#E55A3F] transition-colors flex items-center gap-2 text-[14px] font-medium text-white"
            >
              <Upload className="w-4 h-4" />
              Upload Images
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-[#FFEBEE] rounded-[12px] text-[14px] text-[#C62828]">
          {error}
        </div>
      )}

      {/* Filters – always visible, match design: Filters label left, Reset All right, then Album / Tags / Visibility / Search */}
      <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[24px] mb-[24px]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[14px] font-semibold text-[#0D0D0D]">Filters</h3>
          <button
            type="button"
            onClick={resetFilters}
            className="text-[13px] font-medium text-[#F36A4F] hover:text-[#E55A3F]"
          >
            Reset All
          </button>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-[12px] font-medium text-[#6E6E6E] mb-2">Album</label>
            <select
              value={filterAlbum}
              onChange={(e) => setFilterAlbum(e.target.value)}
              className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#0D0D0D] bg-white focus:outline-none focus:border-[#F36A4F] appearance-none bg-[length:16px] bg-[right_12px_center] bg-no-repeat"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236E6E6E\' stroke-width=\'2\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E")' }}
            >
              <option value="">All Albums</option>
              {albums.map((album) => (
                <option key={album.id} value={album.id}>{album.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[12px] font-medium text-[#6E6E6E] mb-2">Tags</label>
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#0D0D0D] bg-white focus:outline-none focus:border-[#F36A4F] appearance-none bg-[length:16px] bg-[right_12px_center] bg-no-repeat"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236E6E6E\' stroke-width=\'2\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E")' }}
            >
              <option value="">All Tags</option>
              {TAGS.map((tag) => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[12px] font-medium text-[#6E6E6E] mb-2">Visibility</label>
            <select
              value={filterVisibility}
              onChange={(e) => setFilterVisibility(e.target.value)}
              className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#0D0D0D] bg-white focus:outline-none focus:border-[#F36A4F] appearance-none bg-[length:16px] bg-[right_12px_center] bg-no-repeat"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236E6E6E\' stroke-width=\'2\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E")' }}
            >
              <option value="">All</option>
              <option value="Public">Public</option>
              <option value="Private">Private</option>
            </select>
          </div>
          <div>
            <label className="block text-[12px] font-medium text-[#6E6E6E] mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6E6E] pointer-events-none" />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search images..."
                className="w-full h-[44px] pl-[36px] pr-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#0D0D0D] placeholder:text-[#9E9E9E] focus:outline-none focus:border-[#F36A4F]"
              />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-[14px] text-[#6E6E6E]">Loading gallery...</div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-[16px] mb-[24px]">
            <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[16px]">
              <p className="text-[13px] text-[#6E6E6E] mb-1">Total Images</p>
              <p className="text-[24px] font-semibold text-[#0D0D0D]">{images.length}</p>
            </div>

            <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[16px]">
              <p className="text-[13px] text-[#6E6E6E] mb-1">Albums</p>
              <p className="text-[24px] font-semibold text-[#0D0D0D]">{albums.length}</p>
            </div>

            <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[16px]">
              <p className="text-[13px] text-[#6E6E6E] mb-1">Public Images</p>
              <p className="text-[24px] font-semibold text-[#2E7D32]">
                {images.filter((img) => img.visibility === 'Public').length}
              </p>
            </div>

            <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[16px]">
              <p className="text-[13px] text-[#6E6E6E] mb-1">Storage Used</p>
              <p className="text-[24px] font-semibold text-[#0D0D0D]">{formatBytes(totalStorage)}</p>
            </div>
          </div>

          {/* Toolbar */}
          <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[16px] mb-[16px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {selectedImages.length > 0 && (
                  <>
                    <p className="text-[13px] text-[#3D3D3D]">
                      {selectedImages.length} selected
                    </p>
                    <button
                      onClick={() => {
                        setIsMovingToAlbum(true);
                        setShowAlbums(true);
                      }}
                      className="text-[13px] text-[#F36A4F] hover:text-[#E55A3F] font-medium"
                    >
                      Move to Album
                    </button>
                    <button
                      onClick={() => {
                        if (selectedImages.length === 1) {
                          const img = images.find((i: GalleryImage) => i.id === selectedImages[0]);
                          if (img) handleEdit(img, 'tags');
                        } else {
                          setShowBulkTag(true);
                        }
                      }}
                      className="text-[13px] text-[#F36A4F] hover:text-[#E55A3F] font-medium"
                    >
                      Apply Tag
                    </button>
                    <button
                      onClick={() => {
                        if (selectedImages.length === 1) {
                          const img = images.find((i: GalleryImage) => i.id === selectedImages[0]);
                          if (img) handleEdit(img, 'visibility');
                        } else {
                          setShowBulkVisibility(true);
                        }
                      }}
                      className="text-[13px] text-[#F36A4F] hover:text-[#E55A3F] font-medium"
                    >
                      Set Visibility
                    </button>
                    <button
                      onClick={handleBulkDelete}
                      className="text-[13px] text-[#C62828] hover:text-[#B71C1C] font-medium"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg ${viewMode === 'grid' ? 'bg-[#FEF1EE] text-[#F36A4F]' : 'text-[#6E6E6E] hover:bg-[#F3F3F3]'
                    }`}
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg ${viewMode === 'list' ? 'bg-[#FEF1EE] text-[#F36A4F]' : 'text-[#6E6E6E] hover:bg-[#F3F3F3]'
                    }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Images Grid/List */}
          <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[24px]">
            {filterLoading ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-[#F36A4F] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[14px] text-[#6E6E6E] mt-4">Loading...</p>
              </div>
            ) : images.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[14px] text-[#6E6E6E]">No images found matching your filters.</p>
                {(filterAlbum || filterTag || filterVisibility || filterSearch) && (
                  <button
                    onClick={resetFilters}
                    className="mt-2 text-[13px] text-[#F36A4F] hover:text-[#E55A3F] font-medium"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-4 gap-[16px]">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className="relative group cursor-pointer rounded-[12px] overflow-hidden border border-[#DBDBDB] hover:border-[#F36A4F] transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedImages.includes(image.id)}
                      onChange={() => toggleImageSelection(image.id)}
                      className="absolute top-2 left-2 w-4 h-4 accent-[#F36A4F] z-10"
                    />

                    <img
                      src={galleryAssetUrl(image.thumbnail)}
                      alt={image.altText}
                      className="w-full h-48 object-cover cursor-pointer"
                      onClick={() => handlePreview(image)}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-[12px]">
                      <p className="text-[13px] font-semibold text-white mb-2">{image.title}</p>
                    </div>

                    <div className="p-[12px] bg-white group-hover:bg-[#5E5E5E] transition-colors border-t border-[#F0F0F0] relative h-[48px] flex items-center">
                      {/* Default State: Title */}
                      <div className="flex items-center justify-between w-full group-hover:opacity-0 transition-opacity">
                        <p className="text-[13px] font-medium text-[#6E6E6E] truncate pr-8" title={image.title}>
                          {image.title}
                        </p>
                        <div className="absolute right-3">
                          {image.visibility === 'Public' ? (
                            <Eye className="w-4 h-4 text-[#2E7D32]" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-[#6E6E6E]" />
                          )}
                        </div>
                      </div>

                      {/* Hover State: Actions */}
                      <div className="absolute inset-0 px-[12px] flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(image);
                            }}
                            className="flex items-center gap-1.5 text-[12px] text-white hover:text-white/80"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(image);
                            }}
                            className="flex items-center gap-1.5 text-[12px] text-white hover:text-white/80"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                        </div>
                        <div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePreview(image);
                            }}
                            className="hover:opacity-80 transition-opacity"
                            title="Preview"
                          >
                            {image.visibility === 'Public' ? (
                              <Eye className="w-4 h-4 text-[#2E7D32]" />
                            ) : (
                              <EyeOff className="w-4 h-4 text-[#FFFFFF]/60" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className="flex items-center gap-4 p-[12px] rounded-[12px] border border-[#DBDBDB] hover:bg-[#F8F8F8]"
                  >
                    <input
                      type="checkbox"
                      checked={selectedImages.includes(image.id)}
                      onChange={() => toggleImageSelection(image.id)}
                      className="w-4 h-4 accent-[#F36A4F]"
                    />

                    <img
                      src={galleryAssetUrl(image.thumbnail)}
                      alt={image.altText}
                      className="w-16 h-16 object-cover rounded-[8px] cursor-pointer"
                      onClick={() => handlePreview(image)}
                    />

                    <div className="flex-1">
                      <p className="text-[14px] font-semibold text-[#0D0D0D]">{image.title}</p>
                      <p className="text-[12px] text-[#6E6E6E]">{image.caption}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {image.tags.map((tag: string) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-[#F3F3F3] text-[10px] text-[#3D3D3D] rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-right text-[12px] text-[#6E6E6E]">
                      <p>{image.album}</p>
                      <p className="text-[11px]">{image.fileSize}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePreview(image)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F3F3]"
                        title="Preview"
                      >
                        {image.visibility === 'Public' ? (
                          <Eye className="w-4 h-4 text-[#2E7D32]" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-[#6E6E6E]" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDownload(image)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F3F3]"
                        title="Download"
                      >
                        <Download className="w-4 h-4 text-[#3D3D3D]" />
                      </button>
                      <button
                        onClick={() => handleEdit(image)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F3F3]"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4 text-[#3D3D3D]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-[24px]">
          <div className="bg-white rounded-[16px] w-full max-w-[720px]">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={handleUploadFilesSelect}
            />
            <div className="p-[24px] border-b border-[#DBDBDB] flex items-center justify-between">
              <h3 className="text-[18px] font-semibold text-[#0D0D0D]">Upload Images</h3>
              <button
                onClick={() => {
                  setShowUpload(false);
                  setUploadFiles([]);
                  setUploadError(null);
                }}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F3F3]"
              >
                <X className="w-5 h-5 text-[#3D3D3D]" />
              </button>
            </div>

            <div className="p-[24px]">
              {uploadError && (
                <div className="mb-4 p-3 bg-[#FFEBEE] rounded-[12px] text-[13px] text-[#C62828]">
                  {uploadError}
                </div>
              )}
              <div
                role="button"
                tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#DBDBDB] rounded-[12px] p-[48px] text-center hover:border-[#F36A4F] hover:bg-[#FEF1EE] transition-colors cursor-pointer"
              >
                <Upload className="w-12 h-12 text-[#6E6E6E] mx-auto mb-4" />
                <p className="text-[16px] font-semibold text-[#0D0D0D] mb-2">
                  Drag & drop images here
                </p>
                <p className="text-[13px] text-[#6E6E6E] mb-4">
                  or click to browse (JPG, PNG, WebP - Max 10MB each)
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="h-[44px] px-[20px] rounded-full bg-[#F36A4F] hover:bg-[#E55A3F] text-white text-[14px] font-medium"
                >
                  Select Files
                </button>
              </div>

              {uploadFiles.length > 0 && (
                <div className="mt-4">
                  <p className="text-[13px] font-medium text-[#3D3D3D] mb-2">
                    Selected: {uploadFiles.length} file(s)
                  </p>
                  <ul className="space-y-2 max-h-32 overflow-auto">
                    {uploadFiles.map((file: File, i: number) => (
                      <li
                        key={`${file.name}-${i}`}
                        className="flex items-center justify-between py-2 px-3 bg-[#F8F8F8] rounded-[8px] text-[13px] text-[#0D0D0D]"
                      >
                        <span className="truncate flex-1">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeUploadFile(i)}
                          className="ml-2 w-7 h-7 flex items-center justify-center rounded hover:bg-[#FFEBEE] text-[#C62828]"
                          aria-label="Remove"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-6 space-y-3">
                <div>
                  <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                    Add to Album (Optional)
                  </label>
                  <select
                    onChange={(e) => setUploadAlbumId(e.target.value)}
                    className="w-full h-[40px] px-[12px] rounded-[8px] border border-[#DBDBDB] text-[13px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                  >
                    <option value="">No Album (Gallery Root)</option>
                    {albums.map((album: Album) => (
                      <option key={album.id} value={album.id}>{album.name}</option>
                    ))}
                  </select>
                </div>

                <h4 className="text-[13px] font-semibold text-[#0D0D0D] pt-2">Processing Options</h4>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#F36A4F]" />
                  <span className="text-[13px] text-[#3D3D3D]">
                    Auto-resize (thumbnail, medium, large)
                  </span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#F36A4F]" />
                  <span className="text-[13px] text-[#3D3D3D]">Convert to WebP format</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 accent-[#F36A4F]" />
                  <span className="text-[13px] text-[#3D3D3D]">
                    Auto-generate alt text (AI-powered)
                  </span>
                </label>
              </div>
            </div>

            <div className="p-[24px] border-t border-[#DBDBDB] flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowUpload(false);
                  setUploadFiles([]);
                  setUploadError(null);
                  setUploadAlbumId('');
                }}
                className="h-[44px] px-[20px] rounded-full border border-[#DBDBDB] hover:bg-[#F3F3F3] text-[14px] font-medium text-[#3D3D3D]"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadProcess}
                disabled={uploading || uploadFiles.length === 0}
                className="h-[44px] px-[20px] rounded-full bg-[#F36A4F] hover:bg-[#E55A3F] disabled:opacity-50 disabled:cursor-not-allowed text-white text-[14px] font-medium"
              >
                {uploading ? 'Uploading…' : 'Upload & Process'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Editor Modal */}
      {showEditor && selectedImage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-[24px] overflow-auto">
          <input
            type="file"
            ref={replaceFileInputRef}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleReplaceImageChange}
          />
          <div className="bg-white rounded-[16px] w-full max-w-[900px] my-auto">
            <div className="p-[24px] border-b border-[#DBDBDB] flex items-center justify-between">
              <h3 className="text-[18px] font-semibold text-[#0D0D0D]">Edit Image Details</h3>
              <button
                onClick={() => {
                  clearReplacement();
                  setShowEditor(false);
                }}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F3F3]"
              >
                <X className="w-5 h-5 text-[#3D3D3D]" />
              </button>
            </div>

            <div className="p-[24px]">
              <div className="grid grid-cols-2 gap-[24px]">
                <div>
                  <img
                    src={replacementPreviewUrl ?? galleryAssetUrl(selectedImage.thumbnail)}
                    alt={selectedImage.altText}
                    className="w-full rounded-[12px] border border-[#DBDBDB]"
                  />
                  <div className="mt-4 space-y-2 text-[12px] text-[#6E6E6E]">
                    {replacementFile ? (
                      <p>New file: {replacementFile.name}</p>
                    ) : (
                      <>
                        <p>File size: {selectedImage.fileSize}</p>
                        <p>Uploaded: {selectedImage.uploadedOn}</p>
                        <p>By: {selectedImage.uploadedBy}</p>
                      </>
                    )}
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => replaceFileInputRef.current?.click()}
                      className="text-[13px] text-[#F36A4F] hover:text-[#E55A3F] font-medium"
                    >
                      Replace Image
                    </button>
                    {replacementFile && (
                      <button
                        type="button"
                        onClick={clearReplacement}
                        className="text-[13px] text-[#6E6E6E] hover:text-[#3D3D3D]"
                      >
                        Remove replacement
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={imageTitle}
                      onChange={(e) => setImageTitle(e.target.value)}
                      className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                      Caption
                    </label>
                    <textarea
                      value={imageCaption}
                      onChange={(e) => setImageCaption(e.target.value)}
                      className="w-full h-[60px] px-[12px] py-[10px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F] resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                      Alt Text * (for accessibility)
                    </label>
                    <input
                      type="text"
                      value={imageAltText}
                      onChange={(e) => setImageAltText(e.target.value)}
                      className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                      Photographer Credit
                    </label>
                    <input
                      type="text"
                      value={imagePhotographer}
                      onChange={(e) => setImagePhotographer(e.target.value)}
                      className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                      Album
                    </label>
                    <select
                      value={imageAlbum}
                      onChange={(e) => setImageAlbum(e.target.value)}
                      className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                    >
                      <option value="">No album</option>
                      {albums.map((album: Album) => (
                        <option key={album.id} value={album.id}>{album.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className={`p-4 rounded-[12px] transition-all duration-500 ${editorHighlight === 'tags' ? 'bg-[#FEF1EE] ring-2 ring-[#F36A4F]' : ''}`}>
                    <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {imageTags.map((tag: string) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-[#FEF1EE] text-[12px] text-[#F36A4F] rounded flex items-center gap-1"
                        >
                          {tag}
                          <button
                            onClick={() => setImageTags(imageTags.filter((t) => t !== tag))}
                            className="hover:text-[#E55A3F]"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <select
                      onChange={(e) => {
                        if (e.target.value && !imageTags.includes(e.target.value)) {
                          setImageTags([...imageTags, e.target.value]);
                        }
                        e.target.value = '';
                      }}
                      className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                    >
                      <option value="">Add tag...</option>
                      {TAGS.filter((tag) => !imageTags.includes(tag)).map((tag) => (
                        <option key={tag} value={tag}>
                          {tag}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={`p-4 rounded-[12px] transition-all duration-500 ${editorHighlight === 'visibility' ? 'bg-[#FEF1EE] ring-2 ring-[#F36A4F]' : ''}`}>
                    <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                      Visibility
                    </label>
                    <select
                      value={imageVisibility}
                      onChange={(e) => setImageVisibility(e.target.value as any)}
                      className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                    >
                      <option>Public</option>
                      <option>Private</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-[24px] border-t border-[#DBDBDB] flex justify-end gap-3">
              <button
                onClick={() => {
                  clearReplacement();
                  setShowEditor(false);
                }}
                className="h-[44px] px-[20px] rounded-full border border-[#DBDBDB] hover:bg-[#F3F3F3] text-[14px] font-medium text-[#3D3D3D]"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="h-[44px] px-[20px] rounded-full bg-[#F36A4F] hover:bg-[#E55A3F] disabled:opacity-50 disabled:cursor-not-allowed text-white text-[14px] font-medium"
              >
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )
      }

      {/* Albums Sidebar Drawer */}
      {
        showAlbums && (
          <div
            className="fixed inset-0 z-50 overflow-hidden"
            onClick={() => {
              setShowAlbums(false);
              setIsMovingToAlbum(false);
            }}
          >
            <div className="absolute inset-0 bg-black/50" />
            <div
              className="absolute inset-y-0 right-0 max-w-[400px] w-full bg-white shadow-xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-[24px] border-b border-[#DBDBDB] flex items-center justify-between">
                <h2 className="text-[20px] font-semibold text-[#0D0D0D]">
                  {isMovingToAlbum ? 'Move to Album' : 'Albums'}
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingAlbum(null);
                      setNewAlbumName('');
                      setNewAlbumDescription('');
                      setNewAlbumVisibility('Public');
                      setShowNewAlbum(true);
                    }}
                    className="h-[36px] px-[16px] rounded-full bg-[#F36A4F] hover:bg-[#E55A3F] text-white text-[13px] font-medium flex items-center gap-2"
                  >
                    <FolderPlus className="w-4 h-4" />
                    New Album
                  </button>
                  <button
                    onClick={() => {
                      setShowAlbums(false);
                      setIsMovingToAlbum(false);
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F3F3]"
                  >
                    <X className="w-5 h-5 text-[#3D3D3D]" />
                  </button>
                </div>
              </div>

              <div className="p-[24px] overflow-auto flex-1 space-y-3">
                {isMovingToAlbum && (
                  <div
                    onClick={() => handleBulkMove(null)}
                    className="p-[16px] bg-[#F8F8F8] rounded-[12px] border-2 border-dashed border-[#DBDBDB] hover:border-[#F36A4F] hover:bg-white transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-[56px] h-[56px] rounded-[12px] bg-[#E0E0E0] flex items-center justify-center">
                        <X className="w-6 h-6 text-[#9E9E9E]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[15px] font-semibold text-[#0D0D0D]">No Album</h4>
                        <p className="text-[12px] text-[#6E6E6E]">Remove from current album</p>
                      </div>
                    </div>
                  </div>
                )}

                {albums.map((album: Album) => (
                  <div
                    key={album.id}
                    onClick={() => {
                      if (isMovingToAlbum) {
                        handleBulkMove(album.id);
                      } else {
                        setFilterAlbum(album.id);
                        setShowAlbums(false);
                      }
                    }}
                    className={`p-[16px] bg-[#F8F8F8] rounded-[12px] border border-[#DBDBDB] hover:bg-white transition-colors cursor-pointer group ${filterAlbum === album.id && !isMovingToAlbum ? 'ring-2 ring-[#F36A4F] bg-white' : ''
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={galleryAssetUrl(album.coverImage)}
                        alt={album.name}
                        className="w-[56px] h-[56px] rounded-[12px] object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[15px] font-semibold text-[#0D0D0D] truncate group-hover:text-[#F36A4F] transition-colors">
                          {album.name}
                        </h4>
                        <div className="flex items-center gap-3 mt-1 text-[12px] text-[#6E6E6E]">
                          <span>{album.imageCount} images</span>
                          <span>•</span>
                          <span>{album.visibility}</span>
                          {album.createdOn && (
                            <>
                              <span>•</span>
                              <span>{album.createdOn}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditAlbum(album);
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#E0E0E0] text-[#6E6E6E] opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Edit Album"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {albums.length === 0 && (
                  <div className="py-12 text-center text-[#6E6E6E]">
                    <Folder className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p className="text-[14px]">No albums yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      }

      {/* Bulk Apply Tag Modal */}
      {
        showBulkTag && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-[24px]">
            <div className="bg-white rounded-[16px] w-full max-w-[500px]">
              <div className="p-[24px] border-b border-[#DBDBDB] flex items-center justify-between">
                <h3 className="text-[18px] font-semibold text-[#0D0D0D]">Apply Tag</h3>
                <button
                  onClick={() => setShowBulkTag(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F3F3]"
                >
                  <X className="w-5 h-5 text-[#3D3D3D]" />
                </button>
              </div>

              <div className="p-[24px]">
                <div className="mb-6 p-4 bg-[#F8F8F8] rounded-[12px] border border-[#DBDBDB]">
                  <p className="text-[13px] text-[#3D3D3D]">
                    Adding tags to <strong>{selectedImages.length}</strong> image(s).
                  </p>
                </div>

                <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                  Select Tags to Apply
                </label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {bulkTags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-[#FEF1EE] text-[12px] text-[#F36A4F] rounded flex items-center gap-1"
                    >
                      {tag}
                      <button
                        onClick={() => setBulkTags(bulkTags.filter((t: string) => t !== tag))}
                        className="hover:text-[#E55A3F]"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <select
                  onChange={(e) => {
                    if (e.target.value && !bulkTags.includes(e.target.value)) {
                      setBulkTags([...bulkTags, e.target.value]);
                    }
                    e.target.value = '';
                  }}
                  className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                >
                  <option value="">Add tag...</option>
                  {TAGS.filter((tag: string) => !bulkTags.includes(tag)).map((tag: string) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-[24px] border-t border-[#DBDBDB] flex justify-end gap-3">
                <button
                  onClick={() => setShowBulkTag(false)}
                  className="h-[44px] px-[20px] rounded-full border border-[#DBDBDB] hover:bg-[#F3F3F3] text-[14px] font-medium text-[#3D3D3D]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleBulkTagUpdate(bulkTags)}
                  disabled={saving || bulkTags.length === 0}
                  className="h-[44px] px-[24px] rounded-full bg-[#F36A4F] hover:bg-[#E55A3F] disabled:opacity-50 text-white text-[14px] font-medium transition-colors"
                >
                  {saving ? 'Applying...' : `Apply Tags to ${selectedImages.length} Images`}
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Bulk Set Visibility Modal */}
      {
        showBulkVisibility && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-[24px]">
            <div className="bg-white rounded-[16px] w-full max-w-[400px]">
              <div className="p-[24px] border-b border-[#DBDBDB] flex items-center justify-between">
                <h3 className="text-[18px] font-semibold text-[#0D0D0D]">Set Visibility</h3>
                <button
                  onClick={() => setShowBulkVisibility(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F3F3]"
                >
                  <X className="w-5 h-5 text-[#3D3D3D]" />
                </button>
              </div>

              <div className="p-[24px]">
                <div className="mb-6 p-4 bg-[#F8F8F8] rounded-[12px] border border-[#DBDBDB]">
                  <p className="text-[13px] text-[#3D3D3D]">
                    Updating visibility for <strong>{selectedImages.length}</strong> image(s).
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setBulkVisibility('Public')}
                    className={`h-[44px] rounded-[12px] border flex items-center justify-center gap-2 text-[14px] font-medium transition-all ${bulkVisibility === 'Public' ? 'bg-[#E8F5E9] border-[#2E7D32] text-[#2E7D32]' : 'bg-white border-[#DBDBDB] hover:border-[#F36A4F] text-[#3D3D3D]'}`}
                  >
                    <Eye className="w-4 h-4" />
                    Public
                  </button>
                  <button
                    onClick={() => setBulkVisibility('Private')}
                    className={`h-[44px] rounded-[12px] border flex items-center justify-center gap-2 text-[14px] font-medium transition-all ${bulkVisibility === 'Private' ? 'bg-[#F5F5F5] border-[#6E6E6E] text-[#6E6E6E]' : 'bg-white border-[#DBDBDB] hover:border-[#F36A4F] text-[#3D3D3D]'}`}
                  >
                    <EyeOff className="w-4 h-4" />
                    Private
                  </button>
                </div>
              </div>

              <div className="p-[24px] border-t border-[#DBDBDB] flex justify-end gap-3">
                <button
                  onClick={() => setShowBulkVisibility(false)}
                  className="h-[44px] px-[20px] rounded-full border border-[#DBDBDB] hover:bg-[#F3F3F3] text-[14px] font-medium text-[#3D3D3D]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleBulkVisibilityUpdate(bulkVisibility)}
                  disabled={saving}
                  className="h-[44px] px-[24px] rounded-full bg-[#F36A4F] hover:bg-[#E55A3F] disabled:opacity-50 text-white text-[14px] font-medium transition-colors"
                >
                  {saving ? 'Updating...' : `Set to ${bulkVisibility}`}
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* New Album Modal */}
      {
        showNewAlbum && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-[24px]">
            <div className="bg-white rounded-[16px] w-full max-w-[600px] max-h-[90vh] flex flex-col">
              <div className="p-[24px] border-b border-[#DBDBDB] flex items-center justify-between">
                <h3 className="text-[18px] font-semibold text-[#0D0D0D]">{editingAlbum ? 'Edit Album' : 'Create New Album'}</h3>
                <button
                  onClick={() => setShowNewAlbum(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F3F3]"
                >
                  <X className="w-5 h-5 text-[#3D3D3D]" />
                </button>
              </div>

              <div className="p-[24px] overflow-auto flex-1 space-y-6">
                <div>
                  <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                    Album Name *
                  </label>
                  <input
                    type="text"
                    value={newAlbumName}
                    onChange={(e) => setNewAlbumName(e.target.value)}
                    placeholder="e.g., Annual Event 2025"
                    className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                    Description
                  </label>
                  <textarea
                    value={newAlbumDescription}
                    onChange={(e) => setNewAlbumDescription(e.target.value)}
                    className="w-full h-[80px] px-[12px] py-[10px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F] resize-none"
                    placeholder="What is this album about?"
                  />
                </div>

                <div className="grid grid-cols-2 gap-[24px]">
                  <div>
                    <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                      Visibility
                    </label>
                    <select
                      value={newAlbumVisibility}
                      onChange={(e) => setNewAlbumVisibility(e.target.value as any)}
                      className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                    >
                      <option>Public</option>
                      <option>Private</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                      Cover Image
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.onchange = (e: any) => setNewAlbumCover(e.target.files[0]);
                          input.click();
                        }}
                        className="h-[44px] px-[16px] rounded-[12px] border border-[#DBDBDB] hover:bg-[#F3F3F3] text-[13px] font-medium text-[#3D3D3D] flex-1 flex items-center justify-center gap-2"
                      >
                        <ImageIcon className="w-4 h-4" />
                        {newAlbumCover ? 'Change Cover' : 'Pick Cover'}
                      </button>
                      {newAlbumCover && (
                        <div className="w-11 h-11 rounded-lg border border-[#DBDBDB] overflow-hidden relative group">
                          <img
                            src={URL.createObjectURL(newAlbumCover)}
                            className="w-full h-full object-cover"
                            alt="Cover preview"
                          />
                          <button
                            onClick={() => setNewAlbumCover(null)}
                            className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#F0F0F0]">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-[13px] font-semibold text-[#0D0D0D]">
                      Upload Images to this Album
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.multiple = true;
                        input.onchange = (e: any) => {
                          const files = Array.from(e.target.files as FileList);
                          setNewAlbumImages((prev: File[]) => [...prev, ...files]);
                        };
                        input.click();
                      }}
                      className="text-[13px] text-[#F36A4F] hover:text-[#E55A3F] font-medium flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Add Images
                    </button>
                  </div>

                  {newAlbumImages.length > 0 ? (
                    <div className="grid grid-cols-4 gap-3 max-h-[150px] overflow-y-auto pr-1">
                      {newAlbumImages.map((file: File, i: number) => (
                        <div key={i} className="relative aspect-square rounded-[8px] border border-[#DBDBDB] overflow-hidden group">
                          <img
                            src={URL.createObjectURL(file)}
                            className="w-full h-full object-cover"
                            alt="Preview"
                          />
                          <button
                            onClick={() => setNewAlbumImages((prev: File[]) => prev.filter((_: File, idx: number) => idx !== i))}
                            className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 border border-dashed border-[#DBDBDB] rounded-[12px] flex flex-col items-center justify-center bg-[#FDFDFD]">
                      <Upload className="w-6 h-6 text-[#9E9E9E] mb-2" />
                      <p className="text-[12px] text-[#9E9E9E]">No images added yet</p>
                    </div>
                  )}
                </div>

                {editingAlbum && (
                  <div className="pt-4 border-t border-[#F0F0F0]">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-[13px] font-semibold text-[#0D0D0D]">
                        Existing Images ({existingAlbumImages.length})
                      </label>
                    </div>
                    {loadingAlbumImages ? (
                      <div className="text-[12px] text-[#9E9E9E] py-4 text-center">Loading images...</div>
                    ) : existingAlbumImages.length > 0 ? (
                      <div className="grid grid-cols-4 gap-3 max-h-[150px] overflow-y-auto pr-1">
                        {existingAlbumImages.map((img) => (
                          <div key={img.id} className="relative aspect-square rounded-[8px] border border-[#DBDBDB] overflow-hidden group">
                            <img
                              src={galleryAssetUrl(img.thumbnail)}
                              className="w-full h-full object-cover"
                              alt={img.altText}
                            />
                            <button
                              onClick={() => handleRemoveFromAlbum(img.id)}
                              className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Remove from album"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-[12px] text-[#9E9E9E] py-4 text-center">No images in this album.</div>
                    )}
                  </div>
                )}

                {selectedImages.length > 0 && isMovingToAlbum && (
                  <div className="p-3 bg-[#FEF1EE] rounded-[12px] border border-[#F36A4F]/20 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#F36A4F] text-white flex items-center justify-center text-[12px] font-bold">
                      {selectedImages.length}
                    </div>
                    <p className="text-[12px] text-[#3D3D3D]">
                      Selected images will be moved to this new album automatically.
                    </p>
                  </div>
                )}
              </div>

              <div className="p-[24px] border-t border-[#DBDBDB] flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowNewAlbum(false);
                    setNewAlbumImages([]);
                    setNewAlbumCover(null);
                  }}
                  className="h-[44px] px-[20px] rounded-full border border-[#DBDBDB] hover:bg-[#F3F3F3] text-[14px] font-medium text-[#3D3D3D]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateAlbum}
                  disabled={saving || !newAlbumName.trim()}
                  className="h-[44px] px-[24px] rounded-full bg-[#F36A4F] hover:bg-[#E55A3F] disabled:opacity-50 text-white text-[14px] font-medium transition-colors"
                >
                  {saving ? (editingAlbum ? 'Updating...' : 'Creating...') : (editingAlbum ? 'Update Album' : 'Create Album')}
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Delete Modal */}
      {
        showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
            <div className="bg-white rounded-[16px] w-[480px]">
              <div className="p-[24px] border-b border-[#DBDBDB]">
                <h3 className="text-[18px] font-semibold text-[#0D0D0D]">Delete Images</h3>
                <p className="text-[13px] text-[#6E6E6E] mt-1">
                  Please provide a reason for deleting these images
                </p>
              </div>

              <div className="p-[24px]">
                <div className="mb-4 p-[12px] bg-[#FFEBEE] rounded-[8px]">
                  <p className="text-[13px] text-[#C62828]">
                    You are about to delete <strong>{selectedImages.length}</strong> image(s)
                  </p>
                </div>

                <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                  Reason for Deletion *
                </label>
                <textarea
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  className="w-full h-[100px] px-[12px] py-[10px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F] resize-none"
                  placeholder="e.g., Outdated content, quality issues, duplicate"
                />
              </div>

              <div className="p-[24px] border-t border-[#DBDBDB] flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteReason('');
                  }}
                  className="h-[44px] px-[20px] rounded-full border border-[#DBDBDB] hover:bg-[#F3F3F3] text-[14px] font-medium text-[#3D3D3D]"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={!deleteReason.trim()}
                  className="h-[44px] px-[20px] rounded-full bg-[#C62828] hover:bg-[#B71C1C] text-white text-[14px] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Preview Modal */}
      {
        showPreview && previewImage && (
          <div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-[70] p-[24px]"
            onClick={() => setShowPreview(false)}
          >
            <button
              onClick={() => setShowPreview(false)}
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="w-full max-w-[1000px] h-[700px] flex flex-col bg-transparent" onClick={(e) => e.stopPropagation()}>
              <div className="flex-1 flex items-center justify-center min-h-0">
                <img
                  src={galleryAssetUrl(previewImage.thumbnail)}
                  alt={previewImage.altText}
                  className="max-w-full max-h-full object-contain rounded-[12px]"
                />
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-[12px] p-[16px] mt-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-[16px] font-semibold text-white mb-1">
                      {previewImage.title}
                    </h3>
                    {previewImage.caption && (
                      <p className="text-[13px] text-white/80 mb-2">{previewImage.caption}</p>
                    )}
                    <div className="flex items-center gap-3 text-[12px] text-white/70">
                      {previewImage.photographer && <span>Photo by {previewImage.photographer}</span>}
                      {previewImage.uploadedOn && <span>•</span>}
                      {previewImage.uploadedOn && <span>{previewImage.uploadedOn}</span>}
                    </div>
                    {previewImage.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {previewImage.tags.map((tag: string) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-white/20 text-[11px] text-white rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(previewImage);
                      }}
                      className="h-[36px] px-[16px] rounded-full bg-white/20 hover:bg-white/30 text-white text-[13px] font-medium flex items-center gap-2 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>

                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
}
