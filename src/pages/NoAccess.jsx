import React from "react";
import { Card, CardContent } from "../components/ui/card";

export default function NoAccess() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="max-w-md w-full border border-red-300">
        <CardContent className="text-center p-8">
          <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
          <p className="mt-4 text-gray-700">
            You don't have permission to view this page.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
