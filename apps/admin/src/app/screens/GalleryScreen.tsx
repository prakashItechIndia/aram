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
} from 'lucide-react';
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
        const albumsApi = (api as { galleryAlbumsApi?: { galleryAlbumsControllerFindAll: () => Promise<unknown> } }).galleryAlbumsApi;
        if (albumsApi?.galleryAlbumsControllerFindAll) {
          const albRes = await albumsApi.galleryAlbumsControllerFindAll();
          const albData = (albRes as { data?: unknown }).data;
          const albList = Array.isArray(albData) ? albData : [];
          setAlbums(albList.map((row: Record<string, unknown>) => mapApiToAlbum(row)));
        } else {
          setAlbums([]);
        }
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
  }, [api, apiFetch, filterAlbum, filterTag, filterVisibility, filterSearch, isInitialLoad]);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showUpload, setShowUpload] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [showAlbums, setShowAlbums] = useState(false);
  const [showNewAlbum, setShowNewAlbum] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState<GalleryImage | null>(null);

  // Upload modal state
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
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

  const handleEdit = (image: GalleryImage) => {
    setSelectedImage(image);
    setImageTitle(image.title);
    setImageCaption(image.caption);
    setImageAltText(image.altText);
    setImagePhotographer(image.photographer);
    setImageTags(image.tags);
    setImageAlbum(image.album);
    setImageVisibility(image.visibility);
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
      await fetchGallery();
    } catch (e: unknown) {
      setError((e as Error)?.message ?? 'Failed to delete images');
    } finally {
      setSaving(false);
    }
  };

  const toggleImageSelection = (id: string) => {
    setSelectedImages((prev) =>
      prev.includes(id) ? prev.filter((imgId) => imgId !== id) : [...prev, id]
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
        const { imagePath, thumbnailPath } = (await uploadRes.json()) as {
          imagePath: string;
          thumbnailPath?: string;
        };
        const title = file.name.replace(/\.[^.]+$/, '') || file.name;
        const createRes = await apiFetch('/website/gallery', {
          method: 'POST',
          body: JSON.stringify({
            title,
            imagePath,
            thumbnailPath: thumbnailPath ?? imagePath,
            visibility: 'Public',
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
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
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
          <p className="text-[24px] font-semibold text-[#0D0D0D]">—</p>
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
                <button className="text-[13px] text-[#F36A4F] hover:text-[#E55A3F] font-medium">
                  Move to Album
                </button>
                <button className="text-[13px] text-[#F36A4F] hover:text-[#E55A3F] font-medium">
                  Apply Tag
                </button>
                <button className="text-[13px] text-[#F36A4F] hover:text-[#E55A3F] font-medium">
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
              className={`w-8 h-8 flex items-center justify-center rounded-lg ${
                viewMode === 'grid' ? 'bg-[#FEF1EE] text-[#F36A4F]' : 'text-[#6E6E6E] hover:bg-[#F3F3F3]'
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`w-8 h-8 flex items-center justify-center rounded-lg ${
                viewMode === 'list' ? 'bg-[#FEF1EE] text-[#F36A4F]' : 'text-[#6E6E6E] hover:bg-[#F3F3F3]'
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

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-[12px]">
                  <p className="text-[13px] font-semibold text-white mb-1">{image.title}</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(image);
                      }}
                      className="flex items-center gap-1 text-[11px] text-white hover:text-[#F36A4F]"
                    >
                      <Edit className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(image);
                      }}
                      className="flex items-center gap-1 text-[11px] text-white hover:text-[#F36A4F]"
                    >
                      <Download className="w-3 h-3" />
                      Download
                    </button>
                  </div>
                </div>

                <div className="p-[12px] bg-white">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#6E6E6E]">{image.album}</span>
                    {image.visibility === 'Public' ? (
                      <Eye className="w-3 h-3 text-[#2E7D32]" />
                    ) : (
                      <EyeOff className="w-3 h-3 text-[#6E6E6E]" />
                    )}
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
                    {image.tags.map((tag) => (
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
                  {image.visibility === 'Public' ? (
                    <Eye className="w-4 h-4 text-[#2E7D32]" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-[#6E6E6E]" />
                  )}
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
                <h4 className="text-[13px] font-semibold text-[#0D0D0D]">Processing Options</h4>
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
                      {albums.map((album) => (
                        <option key={album.id} value={album.id}>{album.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {imageTags.map((tag) => (
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

                  <div>
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
      )}

      {/* Albums Modal */}
      {showAlbums && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-end z-50">
          <div className="bg-white w-[600px] h-full overflow-auto">
            <div className="sticky top-0 bg-white border-b border-[#DBDBDB] p-[24px] flex items-center justify-between">
              <h3 className="text-[18px] font-semibold text-[#0D0D0D]">Albums</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowNewAlbum(true)}
                  className="h-[36px] px-[16px] rounded-full bg-[#F36A4F] hover:bg-[#E55A3F] text-white text-[13px] font-medium flex items-center gap-2"
                >
                  <FolderPlus className="w-3 h-3" />
                  New Album
                </button>
                <button
                  onClick={() => setShowAlbums(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F3F3]"
                >
                  <X className="w-5 h-5 text-[#3D3D3D]" />
                </button>
              </div>
            </div>

            <div className="p-[24px] space-y-3">
              {albums.map((album) => (
                <div
                  key={album.id}
                  className="p-[16px] bg-[#F8F8F8] rounded-[12px] border border-[#DBDBDB] hover:bg-white transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={galleryAssetUrl(album.coverImage)}
                      alt={album.name}
                      className="w-20 h-20 object-cover rounded-[8px]"
                    />
                    <div className="flex-1">
                      <h4 className="text-[14px] font-semibold text-[#0D0D0D] mb-1">
                        {album.name}
                      </h4>
                      <p className="text-[12px] text-[#6E6E6E] mb-2">
                        {album.imageCount} images • {album.visibility}
                      </p>
                      <p className="text-[11px] text-[#6E6E6E]">Created: {album.createdOn}</p>
                    </div>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F3F3]">
                      <Edit className="w-4 h-4 text-[#3D3D3D]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
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
      )}

      {/* Preview Modal */}
      {showPreview && previewImage && (
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

          <div className="max-w-[90vw] max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <img
              src={galleryAssetUrl(previewImage.thumbnail)}
              alt={previewImage.altText}
              className="max-w-full max-h-[calc(90vh-120px)] object-contain rounded-[12px]"
            />
            
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
                      {previewImage.tags.map((tag) => (
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
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPreview(false);
                      handleEdit(previewImage);
                    }}
                    className="h-[36px] px-[16px] rounded-full bg-[#F36A4F] hover:bg-[#E55A3F] text-white text-[13px] font-medium flex items-center gap-2 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
