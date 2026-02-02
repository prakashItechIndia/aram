import { useState } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Upload,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Folder,
  Tag,
  Search,
  Filter,
  Grid3x3,
  List,
  Download,
  X,
  CheckCircle,
  FolderPlus,
} from 'lucide-react';

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

const mockImages: GalleryImage[] = [
  {
    id: '1',
    title: 'Education Program Launch',
    caption: 'Students receiving new learning materials',
    altText: 'Children smiling with new books and notebooks',
    photographer: 'John Doe',
    tags: ['Education', '2026', 'Chennai'],
    album: 'Education Programs',
    visibility: 'Public',
    uploadedOn: '2026-01-15',
    uploadedBy: 'Content Editor',
    thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300',
    fileSize: '2.4 MB',
  },
  {
    id: '2',
    title: 'Health Camp - Rural Karnataka',
    caption: 'Free health checkup camp in rural village',
    altText: 'Doctor examining patients at health camp',
    photographer: 'Jane Smith',
    tags: ['Healthcare', '2026', 'Karnataka'],
    album: 'Healthcare Initiatives',
    visibility: 'Public',
    uploadedOn: '2026-01-18',
    uploadedBy: 'Admin User',
    thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300',
    fileSize: '3.1 MB',
  },
  {
    id: '3',
    title: 'Community Kitchen Initiative',
    caption: 'Volunteers preparing meals for underprivileged',
    altText: 'Volunteers cooking food in community kitchen',
    photographer: 'Raj Kumar',
    tags: ['Community', '2025', 'Mumbai'],
    album: 'Community Programs',
    visibility: 'Public',
    uploadedOn: '2025-12-20',
    uploadedBy: 'Content Editor',
    thumbnail: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=300',
    fileSize: '1.8 MB',
  },
];

const mockAlbums: Album[] = [
  {
    id: '1',
    name: 'Education Programs',
    coverImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300',
    imageCount: 45,
    visibility: 'Public',
    createdOn: '2025-11-01',
  },
  {
    id: '2',
    name: 'Healthcare Initiatives',
    coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300',
    imageCount: 32,
    visibility: 'Public',
    createdOn: '2025-10-15',
  },
  {
    id: '3',
    name: 'Community Programs',
    coverImage: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=300',
    imageCount: 28,
    visibility: 'Public',
    createdOn: '2025-09-20',
  },
];

const TAGS = ['Education', 'Healthcare', 'Community', 'Events', '2026', '2025', 'Chennai', 'Mumbai', 'Karnataka'];

export function GalleryScreen() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [showAlbums, setShowAlbums] = useState(false);
  const [showNewAlbum, setShowNewAlbum] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');

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
    setShowEditor(true);
  };

  const handleSave = () => {
    console.log('Saving image:', {
      title: imageTitle,
      caption: imageCaption,
      altText: imageAltText,
      photographer: imagePhotographer,
      tags: imageTags,
      album: imageAlbum,
      visibility: imageVisibility,
    });
    setShowEditor(false);
  };

  const handleBulkDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    console.log('Deleting images:', selectedImages, 'Reason:', deleteReason);
    setShowDeleteModal(false);
    setDeleteReason('');
    setSelectedImages([]);
  };

  const toggleImageSelection = (id: string) => {
    setSelectedImages((prev) =>
      prev.includes(id) ? prev.filter((imgId) => imgId !== id) : [...prev, id]
    );
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
              onClick={() => setShowFilters(!showFilters)}
              className="h-[44px] px-[20px] rounded-full border border-[#DBDBDB] bg-white hover:bg-[#F3F3F3] transition-colors flex items-center gap-2 text-[14px] font-medium text-[#3D3D3D]"
            >
              <Filter className="w-4 h-4" />
              Filters
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

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-[16px] mb-[24px]">
        <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[16px]">
          <p className="text-[13px] text-[#6E6E6E] mb-1">Total Images</p>
          <p className="text-[24px] font-semibold text-[#0D0D0D]">{mockImages.length}</p>
        </div>

        <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[16px]">
          <p className="text-[13px] text-[#6E6E6E] mb-1">Albums</p>
          <p className="text-[24px] font-semibold text-[#0D0D0D]">{mockAlbums.length}</p>
        </div>

        <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[16px]">
          <p className="text-[13px] text-[#6E6E6E] mb-1">Public Images</p>
          <p className="text-[24px] font-semibold text-[#2E7D32]">
            {mockImages.filter((img) => img.visibility === 'Public').length}
          </p>
        </div>

        <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[16px]">
          <p className="text-[13px] text-[#6E6E6E] mb-1">Storage Used</p>
          <p className="text-[24px] font-semibold text-[#0D0D0D]">245 MB</p>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[16px] mb-[24px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold text-[#0D0D0D]">Filters</h3>
            <button className="text-[13px] text-[#F36A4F] hover:text-[#E55A3F] font-medium">
              Reset All
            </button>
          </div>

          <div className="grid grid-cols-4 gap-[16px]">
            <div>
              <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">Album</label>
              <select className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]">
                <option>All Albums</option>
                {mockAlbums.map((album) => (
                  <option key={album.id}>{album.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">Tags</label>
              <select className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]">
                <option>All Tags</option>
                {TAGS.map((tag) => (
                  <option key={tag}>{tag}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">Visibility</label>
              <select className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]">
                <option>All</option>
                <option>Public</option>
                <option>Private</option>
              </select>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6E6E]" />
                <input
                  type="text"
                  placeholder="Search images..."
                  className="w-full h-[44px] pl-[36px] pr-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

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
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-4 gap-[16px]">
            {mockImages.map((image) => (
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
                  src={image.thumbnail}
                  alt={image.altText}
                  className="w-full h-48 object-cover"
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
                    <button className="flex items-center gap-1 text-[11px] text-white hover:text-[#F36A4F]">
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
            {mockImages.map((image) => (
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
                  src={image.thumbnail}
                  alt={image.altText}
                  className="w-16 h-16 object-cover rounded-[8px]"
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
                    onClick={() => handleEdit(image)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F3F3]"
                  >
                    <Edit className="w-4 h-4 text-[#3D3D3D]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-[24px]">
          <div className="bg-white rounded-[16px] w-full max-w-[720px]">
            <div className="p-[24px] border-b border-[#DBDBDB] flex items-center justify-between">
              <h3 className="text-[18px] font-semibold text-[#0D0D0D]">Upload Images</h3>
              <button
                onClick={() => setShowUpload(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F3F3]"
              >
                <X className="w-5 h-5 text-[#3D3D3D]" />
              </button>
            </div>

            <div className="p-[24px]">
              <div className="border-2 border-dashed border-[#DBDBDB] rounded-[12px] p-[48px] text-center hover:border-[#F36A4F] hover:bg-[#FEF1EE] transition-colors cursor-pointer">
                <Upload className="w-12 h-12 text-[#6E6E6E] mx-auto mb-4" />
                <p className="text-[16px] font-semibold text-[#0D0D0D] mb-2">
                  Drag & drop images here
                </p>
                <p className="text-[13px] text-[#6E6E6E] mb-4">
                  or click to browse (JPG, PNG, WebP - Max 10MB each)
                </p>
                <button className="h-[44px] px-[20px] rounded-full bg-[#F36A4F] hover:bg-[#E55A3F] text-white text-[14px] font-medium">
                  Select Files
                </button>
              </div>

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
                onClick={() => setShowUpload(false)}
                className="h-[44px] px-[20px] rounded-full border border-[#DBDBDB] hover:bg-[#F3F3F3] text-[14px] font-medium text-[#3D3D3D]"
              >
                Cancel
              </button>
              <button className="h-[44px] px-[20px] rounded-full bg-[#F36A4F] hover:bg-[#E55A3F] text-white text-[14px] font-medium">
                Upload & Process
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Editor Modal */}
      {showEditor && selectedImage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-[24px] overflow-auto">
          <div className="bg-white rounded-[16px] w-full max-w-[900px] my-auto">
            <div className="p-[24px] border-b border-[#DBDBDB] flex items-center justify-between">
              <h3 className="text-[18px] font-semibold text-[#0D0D0D]">Edit Image Details</h3>
              <button
                onClick={() => setShowEditor(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F3F3]"
              >
                <X className="w-5 h-5 text-[#3D3D3D]" />
              </button>
            </div>

            <div className="p-[24px]">
              <div className="grid grid-cols-2 gap-[24px]">
                <div>
                  <img
                    src={selectedImage.thumbnail}
                    alt={selectedImage.altText}
                    className="w-full rounded-[12px] border border-[#DBDBDB]"
                  />
                  <div className="mt-4 space-y-2 text-[12px] text-[#6E6E6E]">
                    <p>File size: {selectedImage.fileSize}</p>
                    <p>Uploaded: {selectedImage.uploadedOn}</p>
                    <p>By: {selectedImage.uploadedBy}</p>
                  </div>
                  <button className="mt-4 text-[13px] text-[#F36A4F] hover:text-[#E55A3F] font-medium">
                    Replace Image
                  </button>
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
                      {mockAlbums.map((album) => (
                        <option key={album.id}>{album.name}</option>
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
                onClick={() => setShowEditor(false)}
                className="h-[44px] px-[20px] rounded-full border border-[#DBDBDB] hover:bg-[#F3F3F3] text-[14px] font-medium text-[#3D3D3D]"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="h-[44px] px-[20px] rounded-full bg-[#F36A4F] hover:bg-[#E55A3F] text-white text-[14px] font-medium"
              >
                Save Changes
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
              {mockAlbums.map((album) => (
                <div
                  key={album.id}
                  className="p-[16px] bg-[#F8F8F8] rounded-[12px] border border-[#DBDBDB] hover:bg-white transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={album.coverImage}
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
    </div>
  );
}
