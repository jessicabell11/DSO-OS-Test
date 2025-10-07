import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, Move, Trash2, Lightbulb, Award, AlertTriangle, Sparkles, Edit2, Play, Square, RefreshCw, ArrowLeft, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StickyNote {
  id: string;
  text: string;
  color: string;
  position: { x: number; y: number };
  category: 'stop' | 'start' | 'continue';
  theme?: string;
  isEditing?: boolean;
  cluster?: number; // Added for clustering
}

interface Theme {
  id: string;
  name: string;
  notes: string[]; // Array of note IDs
  color: string;
}

interface Cluster {
  id: number;
  notes: string[]; // Array of note IDs
  category: 'stop' | 'start' | 'continue';
  center: { x: number; y: number };
}

interface Section {
  id: string;
  title: string;
  category: 'stop' | 'start' | 'continue';
  icon: React.ReactNode;
  color: string;
  position: { x: number; y: number; width: number; height: number };
  expanded?: boolean;
}

interface RetrospectiveWhiteboardProps {
  onClose: () => void;
}

const RetrospectiveWhiteboard: React.FC<RetrospectiveWhiteboardProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<StickyNote[]>([]);
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [themes, setThemes] = useState<Theme[]>([]);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [showThemes, setShowThemes] = useState(false);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [viewportOffset, setViewportOffset] = useState({ x: 0, y: 0 });
  const [isClustered, setIsClustered] = useState(false);
  
  const whiteboardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const noteRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const editInputRefs = useRef<{ [key: string]: HTMLTextAreaElement | null }>({});
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  
  // Define the sections
  const [sections, setSections] = useState<Section[]>([
    {
      id: 'stop-section',
      title: 'Stop',
      category: 'stop',
      icon: <Square className="h-5 w-5 text-red-600" />,
      color: '#fed7d7', // Light red
      position: { x: 0, y: 0, width: 0, height: 0 }, // Will be calculated on render
      expanded: false
    },
    {
      id: 'start-section',
      title: 'Start',
      category: 'start',
      icon: <Play className="h-5 w-5 text-green-600" />,
      color: '#c6f6d5', // Light green
      position: { x: 0, y: 0, width: 0, height: 0 }, // Will be calculated on render
      expanded: false
    },
    {
      id: 'continue-section',
      title: 'Continue',
      category: 'continue',
      icon: <RefreshCw className="h-5 w-5 text-blue-600" />,
      color: '#e0f2fe', // Light blue
      position: { x: 0, y: 0, width: 0, height: 0 }, // Will be calculated on render
      expanded: false
    }
  ]);

  // Constants for note dimensions - smaller to fit 3 horizontally
  const NOTE_WIDTH = 160; // Reduced from 224px to fit 3 notes horizontally
  const NOTE_HEIGHT = 100; // Reduced from 120px
  const NOTE_MARGIN = 12; // Reduced from 16px
  const HEADER_HEIGHT = 50; // Height of section header
  const SECTION_PADDING = 16; // Padding inside the whiteboard
  const SECTION_GAP = 8; // Gap between sections
  const CLUSTER_PADDING = 30; // Padding for clusters

  // Calculate section positions when the whiteboard is rendered
  useEffect(() => {
    calculateSectionPositions();
    
    // Recalculate on window resize
    window.addEventListener('resize', calculateSectionPositions);
    return () => {
      window.removeEventListener('resize', calculateSectionPositions);
    };
  }, [whiteboardRef.current]);

  // Recalculate section positions when notes change
  useEffect(() => {
    adjustSectionSizes();
  }, [notes]);

  // Calculate initial section positions
  const calculateSectionPositions = () => {
    const boardRect = whiteboardRef.current?.getBoundingClientRect();
    if (!boardRect) return;
    
    const sectionWidth = (boardRect.width - (SECTION_PADDING * 2) - (SECTION_GAP * 2)) / 3;
    const sectionHeight = boardRect.height - (SECTION_PADDING * 2);
    
    const updatedSections = sections.map((section, index) => {
      return {
        ...section,
        position: {
          x: SECTION_PADDING + (index * (sectionWidth + SECTION_GAP)),
          y: SECTION_PADDING,
          width: sectionWidth,
          height: sectionHeight
        }
      };
    });
    
    setSections(updatedSections);
  };

  // Adjust section sizes based on note content
  const adjustSectionSizes = () => {
    // Group notes by category
    const notesByCategory: Record<string, StickyNote[]> = {
      'stop': notes.filter(note => note.category === 'stop'),
      'start': notes.filter(note => note.category === 'start'),
      'continue': notes.filter(note => note.category === 'continue')
    };

    // Check if any section needs expansion
    const updatedSections = sections.map(section => {
      const sectionNotes = notesByCategory[section.category];
      
      // If no notes, no need to expand
      if (!sectionNotes || sectionNotes.length === 0) {
        return { ...section, expanded: false };
      }

      // Find the lowest note in this section
      const lowestNoteY = Math.max(
        ...sectionNotes.map(note => note.position.y + NOTE_HEIGHT)
      );
      
      // Calculate if we need more space
      const currentBottomEdge = section.position.y + section.position.height;
      const needsExpansion = lowestNoteY + NOTE_MARGIN > currentBottomEdge;
      
      // If we need expansion, calculate new height
      if (needsExpansion) {
        const newHeight = lowestNoteY + NOTE_MARGIN * 2 - section.position.y;
        return {
          ...section,
          position: {
            ...section.position,
            height: newHeight
          },
          expanded: true
        };
      }
      
      return section;
    });
    
    setSections(updatedSections);
  };

  // Generate a random pastel color
  const generatePastelColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 80%)`;
  };

  // Get color for a note based on its category
  const getNoteColor = (category: 'stop' | 'start' | 'continue') => {
    const section = sections.find(s => s.category === category);
    return section ? section.color : '#f9f9f9';
  };

  // Find a non-overlapping position for a new note
  const findNonOverlappingPosition = (category: 'stop' | 'start' | 'continue') => {
    const section = sections.find(s => s.category === category);
    if (!section) return { x: 0, y: 0 };
    
    // Get notes in this section
    const sectionNotes = notes.filter(note => note.category === category);
    
    // Define the grid for positioning notes
    const gridCellWidth = NOTE_WIDTH + NOTE_MARGIN;
    const gridCellHeight = NOTE_HEIGHT + NOTE_MARGIN;
    
    // Calculate how many notes can fit horizontally in the section
    const maxColumns = Math.floor((section.position.width - NOTE_MARGIN * 2) / gridCellWidth);
    
    // Start with a position just below the header
    const startX = section.position.x + NOTE_MARGIN;
    const startY = section.position.y + HEADER_HEIGHT + NOTE_MARGIN;
    
    // If there are no notes yet, return the starting position
    if (sectionNotes.length === 0) {
      return { x: startX, y: startY };
    }
    
    // Create a grid representation of occupied positions
    const occupiedPositions: boolean[][] = [];
    
    // Calculate the maximum number of rows we might need
    const maxRows = Math.ceil((sectionNotes.length + 1) / maxColumns);
    
    // Initialize the grid with all positions free
    for (let row = 0; row < maxRows * 2; row++) { // Double the rows to ensure we have enough space
      occupiedPositions[row] = [];
      for (let col = 0; col < maxColumns; col++) {
        occupiedPositions[row][col] = false;
      }
    }
    
    // Mark positions as occupied based on existing notes
    sectionNotes.forEach(note => {
      const col = Math.floor((note.position.x - section.position.x - NOTE_MARGIN) / gridCellWidth);
      const row = Math.floor((note.position.y - section.position.y - HEADER_HEIGHT - NOTE_MARGIN) / gridCellHeight);
      
      // Only mark valid positions
      if (row >= 0 && row < occupiedPositions.length && col >= 0 && col < maxColumns) {
        occupiedPositions[row][col] = true;
      }
    });
    
    // Find the first free position
    for (let row = 0; row < occupiedPositions.length; row++) {
      for (let col = 0; col < maxColumns; col++) {
        if (!occupiedPositions[row][col]) {
          const x = startX + (col * gridCellWidth);
          const y = startY + (row * gridCellHeight);
          
          return { x, y };
        }
      }
    }
    
    // If all positions are occupied, stack at the top with a slight offset
    return { 
      x: startX + (Math.random() * 20), 
      y: startY + (Math.random() * 20)
    };
  };

  // Add a new sticky note to a specific section
  const addNote = (category: 'stop' | 'start' | 'continue') => {
    const position = findNonOverlappingPosition(category);
    
    const newNote: StickyNote = {
      id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: '',
      color: getNoteColor(category),
      position,
      category: category,
      isEditing: true // Start in editing mode
    };
    
    setNotes([...notes, newNote]);
    
    // Focus the new note's textarea after it's rendered
    setTimeout(() => {
      const newNoteId = newNote.id;
      if (editInputRefs.current[newNoteId]) {
        editInputRefs.current[newNoteId]?.focus();
      }
    }, 50);
  };

  // Delete a sticky note
  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    
    // Also remove from any themes
    setThemes(themes.map(theme => ({
      ...theme,
      notes: theme.notes.filter(noteId => noteId !== id)
    })));

    // Also remove from any clusters
    setClusters(clusters.map(cluster => ({
      ...cluster,
      notes: cluster.notes.filter(noteId => noteId !== id)
    })));
  };

  // Start editing a note
  const startEditing = (id: string) => {
    setNotes(notes.map(note => 
      note.id === id 
        ? { ...note, isEditing: true } 
        : note
    ));
    
    // Focus the textarea after state update
    setTimeout(() => {
      if (editInputRefs.current[id]) {
        editInputRefs.current[id]?.focus();
      }
    }, 50);
  };

  // Save note text after editing
  const saveNoteText = (id: string, text: string) => {
    setNotes(notes.map(note => 
      note.id === id 
        ? { ...note, text, isEditing: false } 
        : note
    ));
  };

  // Handle key press in edit mode
  const handleKeyDown = (e: React.KeyboardEvent, id: string, text: string) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      saveNoteText(id, text);
    }
  };

  // Start dragging a note
  const startDrag = (e: React.MouseEvent, id: string) => {
    // Don't start dragging if we're editing
    if (notes.find(note => note.id === id)?.isEditing) return;
    
    // Prevent event from bubbling up to the whiteboard's pan handler
    e.stopPropagation();
    
    setActiveNote(id);
    setIsDragging(true);
    
    const note = notes.find(n => n.id === id);
    if (!note) return;
    
    const noteElement = noteRefs.current[id];
    if (!noteElement) return;
    
    const rect = noteElement.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // Handle mouse move during drag
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !activeNote) return;
    
    const whiteboardRect = whiteboardRef.current?.getBoundingClientRect();
    if (!whiteboardRect) return;
    
    const noteElement = noteRefs.current[activeNote];
    if (!noteElement) return;
    
    const noteRect = noteElement.getBoundingClientRect();
    
    // Calculate new position, accounting for zoom level and viewport offset
    let newX = (e.clientX - whiteboardRect.left - dragOffset.x) / zoomLevel - viewportOffset.x;
    let newY = (e.clientY - whiteboardRect.top - dragOffset.y) / zoomLevel - viewportOffset.y;
    
    // Ensure note stays within whiteboard boundaries
    newX = Math.max(0, Math.min(newX, (whiteboardRect.width / zoomLevel) - (noteRect.width / zoomLevel)));
    newY = Math.max(0, Math.min(newY, (whiteboardRect.height / zoomLevel) - (noteRect.height / zoomLevel)));
    
    // Determine which section the note is in
    const activeNoteObj = notes.find(note => note.id === activeNote);
    if (activeNoteObj) {
      let newCategory = activeNoteObj.category;
      
      // Check if the note is in a different section now
      for (const section of sections) {
        if (
          newX >= section.position.x &&
          newX <= section.position.x + section.position.width - (noteRect.width / zoomLevel) &&
          newY >= section.position.y &&
          newY <= section.position.y + section.position.height - (noteRect.height / zoomLevel)
        ) {
          newCategory = section.category;
          break;
        }
      }
      
      // Update note position and category
      const updatedNotes = notes.map(note => 
        note.id === activeNote 
          ? { 
              ...note, 
              position: { x: newX, y: newY },
              category: newCategory,
              color: getNoteColor(newCategory),
              cluster: undefined // Remove from cluster when manually moved
            } 
          : note
      );
      
      setNotes(updatedNotes);
      
      // If we're clustered, update the clusters
      if (isClustered) {
        // Remove the note from any clusters it was in
        const updatedClusters = clusters.map(cluster => ({
          ...cluster,
          notes: cluster.notes.filter(noteId => noteId !== activeNote)
        })).filter(cluster => cluster.notes.length > 0);
        
        setClusters(updatedClusters);
      }
    }
  };

  // End dragging
  const endDrag = () => {
    setIsDragging(false);
    setActiveNote(null);
  };

  // Start panning the whiteboard
  const startPan = (e: React.MouseEvent) => {
    // Only start panning if not already dragging a note and using the primary mouse button
    if (isDragging || e.button !== 0) return;
    
    setIsPanning(true);
    setPanStart({ x: e.clientX, y: e.clientY });
  };

  // Handle mouse move during panning
  const handlePan = (e: MouseEvent) => {
    if (!isPanning) return;
    
    const deltaX = (e.clientX - panStart.x) / zoomLevel;
    const deltaY = (e.clientY - panStart.y) / zoomLevel;
    
    setViewportOffset({
      x: viewportOffset.x + deltaX,
      y: viewportOffset.y + deltaY
    });
    
    setPanStart({ x: e.clientX, y: e.clientY });
  };

  // End panning
  const endPan = () => {
    setIsPanning(false);
  };

  // Handle zoom in
  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2.0));
  };

  // Handle zoom out
  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  };

  // Reset zoom and pan
  const resetView = () => {
    setZoomLevel(1);
    setViewportOffset({ x: 0, y: 0 });
  };

  // Set up event listeners for dragging and panning
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', endDrag);
    }
    
    if (isPanning) {
      window.addEventListener('mousemove', handlePan);
      window.addEventListener('mouseup', endPan);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', endDrag);
      window.removeEventListener('mousemove', handlePan);
      window.removeEventListener('mouseup', endPan);
    };
  }, [isDragging, activeNote, isPanning, panStart, zoomLevel, viewportOffset, notes, isClustered, clusters]);

  // Analyze note content to find similarities
  const analyzeNoteContent = (noteA: StickyNote, noteB: StickyNote): number => {
    if (!noteA.text || !noteB.text) return 0;
    
    const textA = noteA.text.toLowerCase();
    const textB = noteB.text.toLowerCase();
    
    // Simple keyword matching
    const keywordsA = textA.split(/\s+/).filter(word => word.length > 3);
    const keywordsB = textB.split(/\s+/).filter(word => word.length > 3);
    
    let matchCount = 0;
    keywordsA.forEach(word => {
      if (keywordsB.includes(word)) matchCount++;
    });
    
    // Check for common phrases (3+ words in sequence)
    const phrasesA = extractPhrases(textA);
    const phrasesB = extractPhrases(textB);
    
    phrasesA.forEach(phrase => {
      if (phrasesB.some(p => p.includes(phrase) || phrase.includes(p))) {
        matchCount += 2; // Phrases are stronger indicators of similarity
      }
    });
    
    // Check for topic similarity using predefined topics
    const topics = {
      communication: ['communication', 'meeting', 'talk', 'discuss', 'conversation', 'email', 'message', 'chat'],
      process: ['process', 'workflow', 'procedure', 'steps', 'method', 'approach', 'system'],
      technical: ['code', 'technical', 'architecture', 'design', 'implementation', 'develop', 'programming'],
      collaboration: ['team', 'collaborate', 'together', 'coordination', 'cooperate', 'partnership'],
      quality: ['quality', 'testing', 'bugs', 'issues', 'errors', 'problems', 'defects'],
      planning: ['plan', 'schedule', 'timeline', 'deadline', 'milestone', 'roadmap', 'strategy']
    };
    
    let topicMatchCount = 0;
    Object.values(topics).forEach(topicWords => {
      const topicInA = topicWords.some(word => textA.includes(word));
      const topicInB = topicWords.some(word => textB.includes(word));
      
      if (topicInA && topicInB) topicMatchCount++;
    });
    
    matchCount += topicMatchCount * 2; // Topic matches are strong indicators
    
    // Calculate similarity score (0-1)
    const totalKeywords = keywordsA.length + keywordsB.length;
    if (totalKeywords === 0) return 0;
    
    return Math.min(1, (matchCount * 2) / totalKeywords);
  };
  
  // Extract meaningful phrases from text
  const extractPhrases = (text: string): string[] => {
    const words = text.split(/\s+/);
    const phrases: string[] = [];
    
    for (let i = 0; i < words.length - 2; i++) {
      phrases.push(`${words[i]} ${words[i+1]} ${words[i+2]}`);
    }
    
    return phrases;
  };

  // Group notes into clusters based on content similarity
  const clusterNotes = () => {
    // Group notes by category
    const notesByCategory: Record<string, StickyNote[]> = {
      'stop': notes.filter(note => note.category === 'stop' && note.text.trim() !== ''),
      'start': notes.filter(note => note.category === 'start' && note.text.trim() !== ''),
      'continue': notes.filter(note => note.category === 'continue' && note.text.trim() !== '')
    };
    
    const newClusters: Cluster[] = [];
    let clusterIdCounter = 0;
    
    // Process each category separately
    Object.entries(notesByCategory).forEach(([category, categoryNotes]) => {
      if (categoryNotes.length < 2) return; // Need at least 2 notes to form a cluster
      
      // Build similarity matrix
      const similarityMatrix: number[][] = [];
      for (let i = 0; i < categoryNotes.length; i++) {
        similarityMatrix[i] = [];
        for (let j = 0; j < categoryNotes.length; j++) {
          if (i === j) {
            similarityMatrix[i][j] = 1; // Same note has perfect similarity
          } else {
            similarityMatrix[i][j] = analyzeNoteContent(categoryNotes[i], categoryNotes[j]);
          }
        }
      }
      
      // Track which notes have been assigned to clusters
      const assignedNotes = new Set<string>();
      
      // Find clusters using a simple threshold-based approach
      const SIMILARITY_THRESHOLD = 0.3; // Adjust as needed
      
      for (let i = 0; i < categoryNotes.length; i++) {
        if (assignedNotes.has(categoryNotes[i].id)) continue;
        
        const clusterNoteIds: string[] = [categoryNotes[i].id];
        assignedNotes.add(categoryNotes[i].id);
        
        // Find similar notes
        for (let j = 0; j < categoryNotes.length; j++) {
          if (i === j || assignedNotes.has(categoryNotes[j].id)) continue;
          
          if (similarityMatrix[i][j] >= SIMILARITY_THRESHOLD) {
            clusterNoteIds.push(categoryNotes[j].id);
            assignedNotes.add(categoryNotes[j].id);
          }
        }
        
        // Only create clusters with at least 2 notes
        if (clusterNoteIds.length >= 2) {
          // Calculate cluster center based on current note positions
          const clusterNotes = clusterNoteIds.map(id => notes.find(note => note.id === id)!);
          const avgX = clusterNotes.reduce((sum, note) => sum + note.position.x, 0) / clusterNotes.length;
          const avgY = clusterNotes.reduce((sum, note) => sum + note.position.y, 0) / clusterNotes.length;
          
          newClusters.push({
            id: clusterIdCounter++,
            notes: clusterNoteIds,
            category: category as 'stop' | 'start' | 'continue',
            center: { x: avgX, y: avgY }
          });
        } else {
          // If we couldn't form a cluster, remove the note from assigned set
          assignedNotes.delete(categoryNotes[i].id);
        }
      }
      
      // Handle remaining unassigned notes
      const remainingNotes = categoryNotes.filter(note => !assignedNotes.has(note.id));
      if (remainingNotes.length >= 2) {
        const clusterNoteIds = remainingNotes.map(note => note.id);
        
        // Calculate cluster center
        const avgX = remainingNotes.reduce((sum, note) => sum + note.position.x, 0) / remainingNotes.length;
        const avgY = remainingNotes.reduce((sum, note) => sum + note.position.y, 0) / remainingNotes.length;
        
        newClusters.push({
          id: clusterIdCounter++,
          notes: clusterNoteIds,
          category: category as 'stop' | 'start' | 'continue',
          center: { x: avgX, y: avgY }
        });
      }
    });
    
    return newClusters;
  };

  // Arrange notes in clusters
  const arrangeClusteredNotes = (newClusters: Cluster[]) => {
    // Create a copy of notes to modify
    let updatedNotes = [...notes];
    
    // For each cluster, arrange notes in a circular pattern
    newClusters.forEach(cluster => {
      const clusterNoteIds = cluster.notes;
      if (clusterNoteIds.length < 2) return;
      
      // Get the section for this cluster
      const section = sections.find(s => s.category === cluster.category);
      if (!section) return;
      
      // Calculate positions in a circular arrangement
      const angleStep = (2 * Math.PI) / clusterNoteIds.length;
      const radius = Math.max(30, clusterNoteIds.length * 10); // Adjust radius based on cluster size
      
      clusterNoteIds.forEach((noteId, index) => {
        const angle = index * angleStep;
        
        // Calculate position with slight randomness for natural look
        const offsetX = Math.cos(angle) * radius * (0.9 + Math.random() * 0.2);
        const offsetY = Math.sin(angle) * radius * (0.9 + Math.random() * 0.2);
        
        // Ensure the note stays within section boundaries
        const newX = Math.max(
          section.position.x + NOTE_MARGIN,
          Math.min(
            cluster.center.x + offsetX,
            section.position.x + section.position.width - NOTE_WIDTH - NOTE_MARGIN
          )
        );
        
        const newY = Math.max(
          section.position.y + HEADER_HEIGHT + NOTE_MARGIN,
          Math.min(
            cluster.center.y + offsetY,
            section.position.y + section.position.height - NOTE_HEIGHT - NOTE_MARGIN
          )
        );
        
        // Update note position and assign to cluster
        updatedNotes = updatedNotes.map(note => 
          note.id === noteId
            ? { ...note, position: { x: newX, y: newY }, cluster: cluster.id }
            : note
        );
      });
    });
    
    return updatedNotes;
  };

  // Group notes into themes using AI
  const groupNotesIntoThemes = () => {
    setIsAIProcessing(true);
    
    // First, cluster the notes based on content similarity
    setTimeout(() => {
      const newClusters = clusterNotes();
      setClusters(newClusters);
      
      // Arrange notes in clusters
      const updatedNotes = arrangeClusteredNotes(newClusters);
      setNotes(updatedNotes);
      
      // Generate themes based on clusters
      const newThemes = generateThemesFromClusters(newClusters);
      setThemes(newThemes);
      
      setIsClustered(true);
      setShowThemes(true);
      setIsAIProcessing(false);
    }, 2000);
  };

  // Generate themes from clusters
  const generateThemesFromClusters = (newClusters: Cluster[]): Theme[] => {
    // Predefined theme names by category
    const themeNamesByCategory = {
      'stop': [
        'Process Bottlenecks',
        'Technical Debt',
        'Communication Issues',
        'Inefficient Meetings',
        'Unclear Requirements',
        'Scope Creep',
        'Distractions',
        'Redundant Work'
      ],
      'start': [
        'New Initiatives',
        'Process Improvements',
        'Learning Opportunities',
        'Team Building',
        'Automation Ideas',
        'Documentation Needs',
        'Cross-team Collaboration',
        'Innovation Experiments'
      ],
      'continue': [
        'Successful Practices',
        'Team Collaboration',
        'Technical Excellence',
        'Customer Focus',
        'Knowledge Sharing',
        'Quality Standards',
        'Agile Ceremonies',
        'Feedback Loops'
      ]
    };
    
    return newClusters.map((cluster, index) => {
      // Get theme names for this category
      const themeOptions = themeNamesByCategory[cluster.category];
      
      // Select a theme name based on cluster index
      const themeName = themeOptions[index % themeOptions.length];
      
      return {
        id: `theme-${Date.now()}-${index}`,
        name: themeName,
        notes: cluster.notes,
        color: generatePastelColor()
      };
    });
  };

  // Reset themes and clusters
  const resetThemes = () => {
    setThemes([]);
    setClusters([]);
    setShowThemes(false);
    setIsClustered(false);
    setNotes(notes.map(note => ({ ...note, theme: undefined, cluster: undefined })));
  };

  // Save the retrospective
  const saveRetrospective = () => {
    // In a real app, this would save to a database
    console.log('Saving retrospective:', { notes, themes, clusters });
    navigate('/cycle-retrospective');
  };

  // Get icon for a note based on its category
  const getNoteIcon = (category: 'stop' | 'start' | 'continue') => {
    switch (category) {
      case 'stop':
        return <Square size={14} className="text-red-600" />;
      case 'start':
        return <Play size={14} className="text-green-600" />;
      case 'continue':
        return <RefreshCw size={14} className="text-blue-600" />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <button 
            onClick={onClose}
            className="mr-4 text-white hover:text-blue-200 focus:outline-none"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-xl font-semibold">90-Day Cycle Retrospective Whiteboard</h2>
        </div>
        <div className="flex items-center space-x-2">
          {/* Zoom Controls */}
          <div className="flex items-center bg-blue-700 rounded-md mr-4">
            <button
              onClick={zoomOut}
              className="p-2 text-white hover:bg-blue-800 rounded-l-md focus:outline-none"
              title="Zoom Out"
            >
              <ZoomOut size={18} />
            </button>
            <button
              onClick={resetView}
              className="p-2 text-white hover:bg-blue-800 focus:outline-none"
              title="Reset View"
            >
              <Maximize size={18} />
            </button>
            <button
              onClick={zoomIn}
              className="p-2 text-white hover:bg-blue-800 rounded-r-md focus:outline-none"
              title="Zoom In"
            >
              <ZoomIn size={18} />
            </button>
            <span className="px-2 text-white text-sm">
              {Math.round(zoomLevel * 100)}%
            </span>
          </div>
          
          <button
            onClick={groupNotesIntoThemes}
            disabled={notes.length < 3 || isAIProcessing}
            className={`px-4 py-2 rounded-md flex items-center ${
              notes.length < 3 || isAIProcessing
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {isAIProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <Sparkles size={16} className="mr-1" />
                Group with AI
              </>
            )}
          </button>
          
          {showThemes && (
            <button
              onClick={resetThemes}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center"
            >
              Reset Themes
            </button>
          )}
          
          <button
            onClick={saveRetrospective}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Save Retrospective
          </button>
        </div>
      </div>
      
      {/* Controls */}
      <div className="bg-gray-100 px-6 py-3 flex flex-wrap gap-3 items-center border-b border-gray-200">
        <div className="flex-1 flex flex-wrap gap-3 items-center">
          <div className="text-sm text-gray-600">
            Add sticky notes to each section to capture what the team should stop, start, or continue doing.
            <span className="ml-2 text-gray-500">Tip: Use mouse wheel to zoom, or click and drag to pan the whiteboard.</span>
          </div>
        </div>
      </div>
      
      {/* Whiteboard */}
      <div 
        ref={whiteboardRef}
        className="flex-1 overflow-hidden relative bg-gray-50"
        onMouseDown={startPan}
        style={{ cursor: isPanning ? 'grabbing' : 'default' }}
      >
        {/* Zoomable Content Container */}
        <div
          ref={contentRef}
          className="absolute top-0 left-0 w-full h-full transform-origin-top-left transition-transform duration-100"
          style={{
            transform: `scale(${zoomLevel})`,
            width: `${100 / zoomLevel}%`,
            height: `${100 / zoomLevel}%`,
            transformOrigin: 'top left',
          }}
        >
          {/* Sections */}
          {sections.map((section) => (
            <div
              key={section.id}
              ref={el => sectionRefs.current[section.id] = el}
              className="absolute border border-gray-200 rounded-md overflow-auto transition-all duration-300"
              style={{
                left: `${section.position.x + viewportOffset.x}px`,
                top: `${section.position.y + viewportOffset.y}px`,
                width: `${section.position.width}px`,
                height: `${section.position.height}px`,
                backgroundColor: section.color + '40', // Add transparency
                maxHeight: section.expanded ? 
                  `${Math.max(whiteboardRef.current?.clientHeight || 500, section.position.height)}px` : 
                  `${section.position.height}px`
              }}
            >
              {/* Section Header */}
              <div 
                className="sticky top-0 p-3 border-b border-gray-200 flex justify-between items-center z-10"
                style={{ backgroundColor: section.color }}
              >
                <div className="flex items-center">
                  {section.icon}
                  <h3 className="ml-2 font-medium">{section.title}</h3>
                  {section.expanded && (
                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      Expanded
                    </span>
                  )}
                </div>
                <button
                  onClick={() => addNote(section.category)}
                  className="p-1 rounded-full hover:bg-white hover:bg-opacity-20 focus:outline-none"
                >
                  <Plus size={20} />
                </button>
              </div>
              
              {/* Empty State */}
              {notes.filter(note => note.category === section.category).length === 0 && (
                <div className="flex items-center justify-center h-32 text-gray-400 text-sm italic">
                  Click + to add a note
                </div>
              )}
            </div>
          ))}
          
          {/* Cluster backgrounds */}
          {isClustered && clusters.map(cluster => {
            // Get all notes in this cluster
            const clusterNotes = notes.filter(note => note.cluster === cluster.id);
            if (clusterNotes.length < 2) return null;
            
            // Calculate bounding box for the cluster
            const minX = Math.min(...clusterNotes.map(note => note.position.x)) - CLUSTER_PADDING;
            const minY = Math.min(...clusterNotes.map(note => note.position.y)) - CLUSTER_PADDING;
            const maxX = Math.max(...clusterNotes.map(note => note.position.x + NOTE_WIDTH)) + CLUSTER_PADDING;
            const maxY = Math.max(...clusterNotes.map(note => note.position.y + NOTE_HEIGHT)) + CLUSTER_PADDING;
            
            // Find the theme for this cluster
            const theme = themes.find(t => 
              t.notes.some(noteId => cluster.notes.includes(noteId))
            );
            
            return (
              <div
                key={`cluster-${cluster.id}`}
                className="absolute rounded-lg border-2 border-dashed pointer-events-none"
                style={{
                  left: `${minX + viewportOffset.x}px`,
                  top: `${minY + viewportOffset.y}px`,
                  width: `${maxX - minX}px`,
                  height: `${maxY - minY}px`,
                  borderColor: theme?.color || 'rgba(0,0,0,0.1)',
                  backgroundColor: theme?.color ? `${theme.color}20` : 'rgba(0,0,0,0.03)'
                }}
              />
            );
          })}
          
          {/* Theme labels */}
          {showThemes && themes.map(theme => {
            // Find all notes in this theme
            const themeNotes = notes.filter(note => 
              theme.notes.includes(note.id)
            );
            
            // If no notes, don't show the theme
            if (themeNotes.length === 0) return null;
            
            // Calculate the average position of all notes in this theme
            const avgX = themeNotes.reduce((sum, note) => sum + note.position.x, 0) / themeNotes.length;
            const avgY = themeNotes.reduce((sum, note) => sum + note.position.y, 0) / themeNotes.length - 40;
            
            return (
              <div
                key={theme.id}
                className="absolute px-3 py-1 rounded-md text-sm font-medium z-30 transform -translate-x-1/2"
                style={{
                  left: `${avgX + viewportOffset.x}px`,
                  top: `${avgY + viewportOffset.y}px`,
                  backgroundColor: theme.color,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <div className="flex items-center">
                  <Lightbulb size={14} className="mr-1" />
                  {theme.name}
                </div>
              </div>
            );
          })}
          
          {/* Sticky notes */}
          {notes.map(note => (
            <div
              key={note.id}
              ref={el => noteRefs.current[note.id] = el}
              className={`absolute p-2 rounded-md shadow-md ${
                note.isEditing ? 'cursor-text' : 'cursor-move'
              } transition-shadow ${
                activeNote === note.id ? 'shadow-lg z-20' : 'z-10'
              }`}
              style={{
                left: `${note.position.x + viewportOffset.x}px`,
                top: `${note.position.y + viewportOffset.y}px`,
                width: `${NOTE_WIDTH}px`,
                backgroundColor: note.color,
                border: note.theme ? `2px solid ${themes.find(t => t.name === note.theme)?.color || note.color}` : 'none'
              }}
              onMouseDown={(e) => !note.isEditing && startDrag(e, note.id)}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center">
                  {getNoteIcon(note.category)}
                  <Move size={12} className="ml-1 text-gray-500" />
                </div>
                <div className="flex items-center space-x-1">
                  {!note.isEditing && (
                    <button
                      onClick={() => startEditing(note.id)}
                      className="text-gray-500 hover:text-blue-600 focus:outline-none"
                    >
                      <Edit2 size={12} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="text-gray-500 hover:text-red-600 focus:outline-none"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
              
              {note.isEditing ? (
                <textarea
                  ref={el => editInputRefs.current[note.id] = el}
                  value={note.text}
                  onChange={(e) => {
                    setNotes(notes.map(n => 
                      n.id === note.id 
                        ? { ...n, text: e.target.value } 
                        : n
                    ));
                  }}
                  onBlur={(e) => saveNoteText(note.id, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, note.id, note.text)}
                  placeholder="Type your note here..."
                  className="w-full bg-transparent border-none focus:outline-none text-xs text-gray-800 resize-none"
                  rows={3}
                  autoFocus
                />
              ) : (
                <p 
                  className="text-xs text-gray-800 whitespace-pre-wrap break-words min-h-[60px] max-h-[80px] overflow-y-auto"
                  onClick={() => startEditing(note.id)}
                >
                  {note.text || <span className="text-gray-400 italic">Click to add text</span>}
                </p>
              )}
              
              {note.theme && (
                <div className="mt-1 text-xs font-medium text-gray-600 flex items-center">
                  <Lightbulb size={10} className="mr-1" />
                  <span className="truncate">{note.theme}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Footer with stats */}
      <div className="bg-gray-100 px-6 py-3 border-t border-gray-200 flex justify-between items-center">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-red-200 mr-1"></span>
            <span>{notes.filter(n => n.category === 'stop').length} Stop</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-green-200 mr-1"></span>
            <span>{notes.filter(n => n.category === 'start').length} Start</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-blue-200 mr-1"></span>
            <span>{notes.filter(n => n.category === 'continue').length} Continue</span>
          </div>
          {showThemes && (
            <div className="flex items-center">
              <Lightbulb size={14} className="mr-1 text-purple-600" />
              <span>{themes.length} Themes Identified</span>
            </div>
          )}
          {isClustered && (
            <div className="flex items-center">
              <Sparkles size={14} className="mr-1 text-purple-600" />
              <span>{clusters.filter(c => c.notes.length > 0).length} Clusters</span>
            </div>
          )}
        </div>
        <div className="text-sm text-gray-500">
          {isClustered ? 
            "Notes are clustered by AI based on content similarity" : 
            "Click 'Group with AI' to cluster related notes"}
        </div>
      </div>
    </div>
  );
};

export default RetrospectiveWhiteboard;
