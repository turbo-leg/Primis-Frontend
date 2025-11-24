'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CldUploadWidget } from 'next-cloudinary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navigation } from '@/components/navigation';
import { apiClient } from '@/lib/api';
import { NewsCategory, NewsCreate, MediaFile } from '@/types/news';
import { Upload, X, Image as ImageIcon, Video } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreateNewsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<NewsCreate>({
    title: '',
    summary: '',
    content: '',
    category: NewsCategory.GENERAL,
    author_name: '',
    featured_image: '',
    media_files: [],
    is_published: false,
    is_featured: false,
    tags: '',
    meta_description: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleFeaturedImageUpload = (result: any) => {
    const imageUrl = result.info.secure_url;
    setFormData((prev) => ({ ...prev, featured_image: imageUrl }));
    toast.success('Featured image uploaded!');
  };

  const handleMediaUpload = (result: any) => {
    const mediaFile: MediaFile = {
      url: result.info.secure_url,
      type: result.info.resource_type === 'video' ? 'video' : 'image',
      public_id: result.info.public_id,
      resource_type: result.info.resource_type,
    };

    setFormData((prev) => ({
      ...prev,
      media_files: [...(prev.media_files || []), mediaFile],
    }));
    toast.success('Media file added!');
  };

  const removeMediaFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      media_files: prev.media_files?.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await apiClient.createNews(formData);
      toast.success('News article created successfully!');
      router.push('/news');
    } catch (error: any) {
      console.error('Error creating news:', error);
      toast.error(error.response?.data?.detail || 'Failed to create news article');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-primis-navy">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-serif font-light text-primis-navy dark:text-white mb-8">
          Create News Article
        </h1>

        <form onSubmit={handleSubmit}>
          <Card className="mb-6 dark:bg-primis-navy-light border-0 dark:border dark:border-white/10">
            <CardHeader>
              <CardTitle className="text-primis-navy dark:text-white">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  maxLength={255}
                  placeholder="Enter article title"
                  className="dark:bg-primis-navy dark:border-white/20"
                />
              </div>

              {/* Summary */}
              <div>
                <Label htmlFor="summary">Summary *</Label>
                <Textarea
                  id="summary"
                  name="summary"
                  value={formData.summary}
                  onChange={handleInputChange}
                  required
                  minLength={10}
                  maxLength={500}
                  rows={3}
                  placeholder="Brief summary (10-500 characters)"
                  className="dark:bg-primis-navy dark:border-white/20"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.summary.length}/500 characters
                </p>
              </div>

              {/* Content */}
              <div>
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  minLength={50}
                  rows={10}
                  placeholder="Full article content (minimum 50 characters)"
                  className="dark:bg-primis-navy dark:border-white/20"
                />
              </div>

              {/* Category and Author */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleSelectChange('category', value)}
                  >
                    <SelectTrigger className="dark:bg-primis-navy dark:border-white/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(NewsCategory).map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat.replace('_', ' ').toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="author_name">Author Name *</Label>
                  <Input
                    id="author_name"
                    name="author_name"
                    value={formData.author_name}
                    onChange={handleInputChange}
                    required
                    maxLength={100}
                    placeholder="Author name"
                    className="dark:bg-primis-navy dark:border-white/20"
                  />
                </div>
              </div>

              {/* Tags and Meta Description */}
              <div>
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  maxLength={500}
                  placeholder="Comma-separated tags (e.g., science, technology, innovation)"
                  className="dark:bg-primis-navy dark:border-white/20"
                />
              </div>

              <div>
                <Label htmlFor="meta_description">Meta Description (SEO)</Label>
                <Textarea
                  id="meta_description"
                  name="meta_description"
                  value={formData.meta_description}
                  onChange={handleInputChange}
                  maxLength={160}
                  rows={2}
                  placeholder="SEO-friendly description (max 160 characters)"
                  className="dark:bg-primis-navy dark:border-white/20"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.meta_description?.length || 0}/160 characters
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Media Upload */}
          <Card className="mb-6 dark:bg-primis-navy-light border-0 dark:border dark:border-white/10">
            <CardHeader>
              <CardTitle className="text-primis-navy dark:text-white">Media Files</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Featured Image */}
              <div>
                <Label>Featured Image</Label>
                <div className="mt-2">
                  <CldUploadWidget
                    uploadPreset="news_uploads"
                    onSuccess={handleFeaturedImageUpload}
                  >
                    {({ open }) => (
                      <Button
                        type="button"
                        onClick={() => open()}
                        variant="outline"
                        className="w-full"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Featured Image
                      </Button>
                    )}
                  </CldUploadWidget>
                  {formData.featured_image && (
                    <div className="mt-2 p-2 bg-gray-100 dark:bg-primis-navy rounded">
                      <p className="text-sm truncate">{formData.featured_image}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Media */}
              <div>
                <Label>Additional Photos/Videos</Label>
                <div className="mt-2">
                  <CldUploadWidget
                    uploadPreset="news_uploads"
                    onSuccess={handleMediaUpload}
                  >
                    {({ open }) => (
                      <Button
                        type="button"
                        onClick={() => open()}
                        variant="outline"
                        className="w-full"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Add More Media
                      </Button>
                    )}
                  </CldUploadWidget>

                  {/* Media List */}
                  {formData.media_files && formData.media_files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {formData.media_files.map((media, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-100 dark:bg-primis-navy rounded"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {media.type === 'video' ? (
                              <Video className="w-4 h-4 text-primis-navy dark:text-white flex-shrink-0" />
                            ) : (
                              <ImageIcon className="w-4 h-4 text-primis-navy dark:text-white flex-shrink-0" />
                            )}
                            <span className="text-sm truncate">{media.url}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeMediaFile(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Publishing Options */}
          <Card className="mb-6 dark:bg-primis-navy-light border-0 dark:border dark:border-white/10">
            <CardHeader>
              <CardTitle className="text-primis-navy dark:text-white">Publishing Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_published"
                  checked={formData.is_published}
                  onChange={(e) => handleCheckboxChange('is_published', e.target.checked)}
                  className="w-4 h-4"
                />
                <Label htmlFor="is_published" className="cursor-pointer">
                  Publish immediately
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={formData.is_featured}
                  onChange={(e) => handleCheckboxChange('is_featured', e.target.checked)}
                  className="w-4 h-4"
                />
                <Label htmlFor="is_featured" className="cursor-pointer">
                  Feature on homepage (carousel)
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-primis-navy dark:bg-white text-white dark:text-primis-navy"
            >
              {isLoading ? 'Creating...' : 'Create Article'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
