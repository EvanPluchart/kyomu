"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Tag } from "lucide-react";
import { TagBadge } from "@/components/library/tag-badge";

interface TagData {
  id: number;
  name: string;
  color: string;
  seriesCount: number;
}

export default function TagsPage() {
  const [allTags, setTags] = useState<TagData[]>([]);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("#e8a030");

  useEffect(() => {
    fetch("/api/tags")
      .then((r) => r.json())
      .then((d) => setTags(d.tags))
      .catch(() => {});
  }, []);

  async function handleCreate() {
    if (!newName.trim()) return;
    await fetch("/api/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim(), color: newColor }),
    });
    setNewName("");
    const res = await fetch("/api/tags");
    const data = await res.json();
    setTags(data.tags);
  }

  async function handleDelete(tagId: number) {
    await fetch(`/api/tags/${tagId}`, { method: "DELETE" });
    setTags((prev) => prev.filter((t) => t.id !== tagId));
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <h1
        className="text-3xl font-bold tracking-tight"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Tags
      </h1>

      {/* Create tag form */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Nouveau tag..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          className="h-10 flex-1 rounded-xl border-0 bg-muted/50 px-4 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <input
          type="color"
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
          className="h-10 w-10 cursor-pointer rounded-lg border-0 bg-transparent"
        />
        <Button
          onClick={handleCreate}
          className="gap-2 rounded-xl"
          disabled={!newName.trim()}
        >
          <Plus className="h-4 w-4" />
          Créer
        </Button>
      </div>

      {/* Tags list */}
      {allTags.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <Tag className="h-16 w-16 text-muted-foreground" />
          <p className="text-muted-foreground">Aucun tag créé.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {allTags.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center justify-between rounded-xl bg-card p-3"
            >
              <div className="flex items-center gap-3">
                <TagBadge name={tag.name} color={tag.color} />
                <span className="text-xs text-muted-foreground">
                  {tag.seriesCount} {tag.seriesCount > 1 ? "séries" : "série"}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(tag.id)}
                className="text-destructive hover:text-destructive cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
