import {
  Bot, Brain, Layers, Workflow, Gauge, Sparkles, Component, Server, Cloud,
  Terminal, Network, ShieldCheck, Mail, Menu, X,
  ArrowRight, ArrowUpRight, ArrowDown, Check, ChevronRight, ChevronDown, ChevronLeft,
  Plus, Trash2, Pencil, Save, Download, Upload, RefreshCw, Shuffle, Palette, Type,
  SlidersHorizontal, LayoutDashboard, Package, Briefcase, MessageSquare, Settings,
  Eye, EyeOff, Lock, LogOut, Mic, MicOff, Volume2, Search, Copy, ExternalLink,
  Star, Quote, MapPin, Clock, Zap, Cpu, Code2, Rocket, Database, GitBranch, Boxes,
  Blocks, Wand2, Fingerprint, Braces, LineChart, CircleDot, MoveUp, MoveDown, Play,
  Sun, Moon, Send, Phone, Calendar, Waves, Grid3x3, Circle, type LucideIcon,
} from "lucide-react";

/** Named registry — content stores icon names as strings; the admin picks from these keys. */
export const ICONS: Record<string, LucideIcon> = {
  Bot, Brain, Layers, Workflow, Gauge, Sparkles, Component, Server, Cloud,
  Terminal, Network, ShieldCheck, Mail, Menu, X,
  ArrowRight, ArrowUpRight, ArrowDown, Check, ChevronRight, ChevronDown, ChevronLeft,
  Plus, Trash2, Pencil, Save, Download, Upload, RefreshCw, Shuffle, Palette, Type,
  SlidersHorizontal, LayoutDashboard, Package, Briefcase, MessageSquare, Settings,
  Eye, EyeOff, Lock, LogOut, Mic, MicOff, Volume2, Search, Copy, ExternalLink,
  Star, Quote, MapPin, Clock, Zap, Cpu, Code2, Rocket, Database, GitBranch, Boxes,
  Blocks, Wand2, Fingerprint, Braces, LineChart, CircleDot, MoveUp, MoveDown, Play,
  Sun, Moon, Send, Phone, Calendar, Waves, Grid3x3, Circle,
};

/** Icon names that make sense to attach to a service / product / capability. */
export const CONTENT_ICONS = [
  "Bot", "Brain", "Layers", "Workflow", "Gauge", "Sparkles", "Component", "Server",
  "Cloud", "Terminal", "Network", "ShieldCheck", "Cpu", "Code2", "Rocket", "Database",
  "GitBranch", "Boxes", "Blocks", "Wand2", "Fingerprint", "Braces", "LineChart", "Zap",
  "Package", "MessageSquare", "Waves",
];

export function Icon({
  name,
  className,
  size,
  strokeWidth = 1.75,
}: {
  name: string;
  className?: string;
  size?: number;
  strokeWidth?: number;
}) {
  const Cmp = ICONS[name] ?? Circle;
  return <Cmp className={className} size={size} strokeWidth={strokeWidth} aria-hidden />;
}
