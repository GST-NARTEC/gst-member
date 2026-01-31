import React from "react";
import MainLayout from "../../layout/PortalLayouts/MainLayout";
import { useGetFilesQuery } from "../../store/apis/endpoints/files";
import { FaFilePdf, FaDownload, FaCalendarAlt, FaSync } from "react-icons/fa";
import { Skeleton, Button, Tooltip } from "@heroui/react";

function UserGuides() {
  const { data, isLoading, error, refetch, isFetching } = useGetFilesQuery();

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleFileClick = (filePath) => {
    window.open(filePath, "_blank");
  };

  const handleRefresh = async () => {
    await refetch();
  };

  return (
    <MainLayout>
      <div className="user-guides-container max-w-7xl mx-auto py-8 px-4 min-h-screen">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">User Guides</h1>
            <p className="text-gray-600">
              Access helpful documents and guides to get the most out of your
              membership
            </p>
          </div>
          <Tooltip content="Refresh User Guides">
            <Button
              isIconOnly
              variant="light"
              isLoading={isFetching}
              onClick={handleRefresh}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <FaSync
                className={`text-xl ${isFetching ? "animate-spin" : ""}`}
              />
            </Button>
          </Tooltip>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
              >
                {/* Card Header Skeleton */}
                <div className="bg-gradient-to-br from-gray-500 to-gray-700 p-6">
                  <Skeleton className="w-12 h-12 rounded-lg mb-3" />
                  <Skeleton className="w-24 h-4 rounded" />
                </div>

                {/* Card Body Skeleton */}
                <div className="p-6 space-y-4">
                  <Skeleton className="w-full h-6 rounded" />
                  <Skeleton className="w-3/4 h-6 rounded" />

                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between">
                      <Skeleton className="w-20 h-4 rounded" />
                      <Skeleton className="w-16 h-6 rounded-full" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="w-20 h-4 rounded" />
                      <Skeleton className="w-24 h-4 rounded" />
                    </div>
                    <Skeleton className="w-24 h-6 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-semibold">
              Failed to load user guides
            </p>
            <p className="text-red-500 text-sm mt-2">
              {error?.data?.message || "Please try again later"}
            </p>
          </div>
        )}

        {!isLoading && !error && data?.data?.files?.length === 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
            <FaFilePdf className="text-gray-400 text-6xl mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No user guides available</p>
            <p className="text-gray-500 text-sm mt-2">
              Check back later for helpful documents and resources
            </p>
          </div>
        )}

        {!isLoading && !error && data?.data?.files?.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.data.files.map((file) => (
              <div
                key={file.id}
                onClick={() => handleFileClick(file.path)}
                className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 hover:border-gray-300 transform hover:-translate-y-1"
              >
                {/* Card Header with Icon */}
                <div className="bg-gradient-to-br from-gray-500 to-gray-700 p-6 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
                  <FaFilePdf className="text-5xl mb-3 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                  <div className="flex items-center gap-2 relative z-10">
                    <FaDownload className="text-sm opacity-75 group-hover:opacity-100 transition-opacity" />
                    <span className="text-sm font-medium opacity-75 group-hover:opacity-100 transition-opacity">
                      Click to open
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 line-clamp-2 group-hover:text-gray-600 transition-colors">
                    {file.name}
                  </h3>

                  <div className="space-y-3">
                    {/* File Size */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 font-medium">
                        File Size:
                      </span>
                      <span className="text-gray-700 font-semibold bg-gray-100 px-3 py-1 rounded-full">
                        {formatFileSize(file.size)}
                      </span>
                    </div>

                    {/* Upload Date */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 font-medium flex items-center gap-1">
                        <FaCalendarAlt className="text-xs" />
                        Uploaded:
                      </span>
                      <span className="text-gray-700 font-semibold">
                        {formatDate(file.createdAt)}
                      </span>
                    </div>

                    {/* File Type Badge */}
                    <div className="pt-2">
                      <span className="inline-block bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
                        {file.mimeType === "application/pdf"
                          ? "PDF Document"
                          : file.mimeType}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer - Hover Effect */}
                <div className="h-1 bg-gradient-to-r from-gray-500 to-gray-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Info */}
        {!isLoading && !error && data?.data?.pagination && (
          <div className="mt-8 text-center text-gray-600 text-sm">
            Showing {data.data.files.length} of {data.data.pagination.total}{" "}
            guide{data.data.pagination.total !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default UserGuides;
