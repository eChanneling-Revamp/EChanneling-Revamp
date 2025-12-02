"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRoleProtection } from "@/hooks/useRoleProtection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
  Save,
  Printer,
  FileText,
  Link,
  Unlink,
  Pill,
  Apple,
  Clock,
} from "lucide-react";

export default function PrescriptionsPage() {
  const { isAuthorized, isLoading } = useRoleProtection({
    allowedRoles: ["doctor"],
  });

  const [title, setTitle] = useState("");
  const [editorElement, setEditorElement] = useState<HTMLDivElement | null>(
    null
  );

  // Callback ref to get the editor element
  const editorRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      setEditorElement(node);
    }
  }, []);

  const [showSlashCommand, setShowSlashCommand] = useState(false);
  const [slashCommandPosition, setSlashCommandPosition] = useState({
    top: 0,
    left: 0,
  });
  const [slashRange, setSlashRange] = useState<Range | null>(null);
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);
  const [drugSuggestions, setDrugSuggestions] = useState<
    Array<{ name: string; url: string }>
  >([]);
  const [showDrugSuggestions, setShowDrugSuggestions] = useState(false);
  const [drugSuggestionsPosition, setDrugSuggestionsPosition] = useState({
    top: 0,
    left: 0,
  });
  const [activeDrugInput, setActiveDrugInput] =
    useState<HTMLInputElement | null>(null);
  const [selectedDrugIndex, setSelectedDrugIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedComponent, setDraggedComponent] = useState<HTMLElement | null>(
    null
  );
  const [dragPlaceholder, setDragPlaceholder] = useState<HTMLElement | null>(
    null
  );

  const commandItems = [
    {
      id: "medication",
      label: "💊 Medication",
      description: "Add tablet with dosage & timing",
      icon: Pill,
      color: "blue",
    },
    {
      id: "dietary",
      label: "🍎 Dietary Instructions",
      description: "Foods to include & avoid",
      icon: Apple,
      color: "green",
    },
    {
      id: "instructions",
      label: "📋 General Instructions",
      description: "Add custom instructions",
      icon: Clock,
      color: "purple",
    },
  ];

  const applyFormat = (command: string, value?: string) => {
    if (command === "createLink") {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      // Check if selection is within a link
      let linkElement = null;
      let node = selection.anchorNode;
      while (node && node !== editorElement) {
        if (
          node.nodeType === Node.ELEMENT_NODE &&
          (node as HTMLElement).tagName === "A"
        ) {
          linkElement = node as HTMLAnchorElement;
          break;
        }
        node = node.parentNode;
      }

      if (linkElement) {
        // If clicking on existing link, show edit options
        const currentUrl = linkElement.href;
        const newUrl = prompt(
          "Edit URL (leave empty to remove link):",
          currentUrl
        );
        if (newUrl === null) return; // User cancelled
        if (newUrl === "") {
          // Remove link
          document.execCommand("unlink");
        } else if (newUrl !== currentUrl) {
          // Update link
          linkElement.href = newUrl;
        }
      } else {
        // Create new link
        const url = prompt("Enter URL:");
        if (url) {
          document.execCommand(command, false, url);
        }
      }
    } else if (command === "unlink") {
      document.execCommand("unlink", false);
    } else {
      document.execCommand(command, false, value);
    }
    editorElement?.focus();
  };

  // Fetch drug suggestions
  const fetchDrugSuggestions = async (query: string) => {
    if (query.length < 2) {
      setDrugSuggestions([]);
      setShowDrugSuggestions(false);
      return;
    }

    try {
      const response = await fetch(`/api/drugs?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setDrugSuggestions(data);
      setShowDrugSuggestions(data.length > 0);
      setSelectedDrugIndex(0);
    } catch (error) {
      console.error("Error fetching drug suggestions:", error);
      setDrugSuggestions([]);
      setShowDrugSuggestions(false);
    }
  };

  // Handle drug selection
  const selectDrug = (drugName: string) => {
    if (activeDrugInput) {
      activeDrugInput.value = drugName;
      setShowDrugSuggestions(false);
      setActiveDrugInput(null);
    }
  };

  const handleSave = () => {
    const content = editorElement?.innerHTML || "";
    const prescription = {
      title,
      content,
      timestamp: new Date().toISOString(),
    };
    alert("Prescription saved successfully!");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEditorInput = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const textBeforeCursor =
      range.startContainer.textContent?.slice(0, range.startOffset) || "";

    // Check if last character is "/"
    if (textBeforeCursor.endsWith("/")) {
      // Create a temporary span at cursor position to get exact coordinates
      const tempSpan = document.createElement("span");
      tempSpan.textContent = "\u200B"; // Zero-width space
      range.insertNode(tempSpan);

      // Get the exact position of the cursor
      const rect = tempSpan.getBoundingClientRect();

      // Get the editor container position
      const editorContainer = editorElement?.getBoundingClientRect();

      // Remove the temporary span
      tempSpan.remove();

      if (editorContainer) {
        // Calculate position relative to the editor container
        setSlashCommandPosition({
          top: rect.bottom - editorContainer.top + editorElement!.scrollTop + 5,
          left: rect.left - editorContainer.left,
        });
        setSlashRange(range.cloneRange());
        setSelectedCommandIndex(0);
        setShowSlashCommand(true);
      }
    } else {
      setShowSlashCommand(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSlashCommand) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedCommandIndex((prev) =>
          prev < commandItems.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedCommandIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        e.preventDefault();
        insertMedicationTemplate(commandItems[selectedCommandIndex].id);
        break;
      case "Escape":
        e.preventDefault();
        setShowSlashCommand(false);
        break;
    }
  };

  const insertMedicationTemplate = (type: string) => {
    if (!slashRange || !editorElement) return;

    // Remove the "/" character
    slashRange.setStart(slashRange.startContainer, slashRange.startOffset - 1);
    slashRange.deleteContents();

    let template = "";
    switch (type) {
      case "medication":
        template = `<div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; margin: 8px 0; position: relative;" data-medication-container class="medication-container-hover" contenteditable="false"><div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;"><div style="display: flex; align-items: center; gap: 8px;"><svg style="cursor: grab; color: #9ca3af; flex-shrink: 0; transition: color 0.2s ease;" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" title="Drag to reorder" data-drag-handle onmouseover="this.style.color='#3b82f6'" onmouseout="this.style.color='#9ca3af'"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg><div style="display: flex; align-items: center; gap: 8px; cursor: pointer;" onclick="const content = this.closest('[data-medication-container]').querySelector('[data-medication-content]'); const icon = this.querySelector('[data-collapse-icon]'); if(content.style.display === 'none') { content.style.display = 'block'; icon.style.transform = 'rotate(0deg)'; } else { content.style.display = 'none'; icon.style.transform = 'rotate(-90deg)'; }"><svg data-collapse-icon width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transition: transform 0.2s ease;"><path d="M6 9l6 6 6-6"/></svg><p style="margin: 0; font-weight: 600; color: #1f2937;">💊 Medication</p></div></div><div style="display: flex; gap: 8px;"><button contenteditable="false" onclick="const container = this.closest('[data-medication-container]');const newMed = document.createElement('div');newMed.style.cssText = 'border-top: 1px dashed #d1d5db; margin-top: 8px; padding-top: 8px; position: relative;';newMed.setAttribute('data-medication-item', '');newMed.setAttribute('contenteditable', 'false');newMed.className = 'medication-item-hover';newMed.innerHTML = '<button contenteditable=\\'false\\' onclick=\\'this.closest(&quot;[data-medication-item]&quot;).remove(); event.preventDefault();\\' style=\\'position: absolute; top: 8px; right: 0; background: #ef4444; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 12px; align-items: center; gap: 4px; opacity: 0; transition: opacity 0.2s ease-in-out; display: flex;\\' onmouseover=\\'this.style.background=&quot;#dc2626&quot;\\' onmouseout=\\'this.style.background=&quot;#ef4444&quot;\\' title=\\'Remove medication\\' class=\\'delete-btn\\'><svg width=\\'14\\' height=\\'14\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'currentColor\\' stroke-width=\\'2\\' stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\'><path d=\\'M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6\\'/></svg></button><div style=\\'margin: 8px 0; padding-right: 60px; display: flex; align-items: center; gap: 8px;\\'><label style=\\'color: #6b7280; font-weight: 500; min-width: 60px;\\'>Name:</label><input type=\\'text\\' data-drug-input placeholder=\\'Enter medication name\\' style=\\'flex: 1; padding: 6px 10px; border: none; border-radius: 6px; font-size: 14px; color: #1f2937; outline: none; background: transparent;\\' onfocus=\\'this.style.background=&quot;#f9fafb&quot;\\' onblur=\\'this.style.background=&quot;transparent&quot;\\'></div><div style=\\'margin: 8px 0; display: flex; align-items: center; gap: 8px;\\'><label style=\\'color: #6b7280; font-weight: 500; min-width: 60px;\\'>Dosage:</label><input type=\\'text\\' placeholder=\\'Enter dosage\\' style=\\'flex: 1; padding: 6px 10px; border: none; border-radius: 6px; font-size: 14px; color: #1f2937; outline: none; background: transparent;\\' onfocus=\\'this.style.background=&quot;#f9fafb&quot;\\' onblur=\\'this.style.background=&quot;transparent&quot;\\'></div><div style=\\'margin: 8px 0;\\'><label style=\\'display: block; color: #6b7280; margin-bottom: 6px; font-weight: 500;\\'>Frequency:</label><div style=\\'display: flex; flex-wrap: wrap; gap: 12px;\\' data-day-checkboxes><label style=\\'display: flex; align-items: center; gap: 6px; cursor: pointer;\\' contenteditable=\\'false\\'><input type=\\'checkbox\\' style=\\'cursor: pointer;\\' onclick=\\'const container = this.closest(&quot;[data-medication-item]&quot;); const allCheckboxes = container.querySelectorAll(&quot;[data-day-checkboxes] input[type=checkbox]&quot;); const anyChecked = Array.from(allCheckboxes).some(cb => cb.checked); const radios = container.querySelectorAll(&quot;input[type=radio]&quot;); radios.forEach(r => { r.disabled = anyChecked; r.checked = false; r.parentElement.style.opacity = anyChecked ? &quot;0.5&quot; : &quot;1&quot;; r.parentElement.style.cursor = anyChecked ? &quot;not-allowed&quot; : &quot;pointer&quot;; });\\'><span>Morning</span></label><label style=\\'display: flex; align-items: center; gap: 6px; cursor: pointer;\\' contenteditable=\\'false\\'><input type=\\'checkbox\\' style=\\'cursor: pointer;\\' onclick=\\'const container = this.closest(&quot;[data-medication-item]&quot;); const allCheckboxes = container.querySelectorAll(&quot;[data-day-checkboxes] input[type=checkbox]&quot;); const anyChecked = Array.from(allCheckboxes).some(cb => cb.checked); const radios = container.querySelectorAll(&quot;input[type=radio]&quot;); radios.forEach(r => { r.disabled = anyChecked; r.checked = false; r.parentElement.style.opacity = anyChecked ? &quot;0.5&quot; : &quot;1&quot;; r.parentElement.style.cursor = anyChecked ? &quot;not-allowed&quot; : &quot;pointer&quot;; });\\'><span>Afternoon</span></label><label style=\\'display: flex; align-items: center; gap: 6px; cursor: pointer;\\' contenteditable=\\'false\\'><input type=\\'checkbox\\' style=\\'cursor: pointer;\\' onclick=\\'const container = this.closest(&quot;[data-medication-item]&quot;); const allCheckboxes = container.querySelectorAll(&quot;[data-day-checkboxes] input[type=checkbox]&quot;); const anyChecked = Array.from(allCheckboxes).some(cb => cb.checked); const radios = container.querySelectorAll(&quot;input[type=radio]&quot;); radios.forEach(r => { r.disabled = anyChecked; r.checked = false; r.parentElement.style.opacity = anyChecked ? &quot;0.5&quot; : &quot;1&quot;; r.parentElement.style.cursor = anyChecked ? &quot;not-allowed&quot; : &quot;pointer&quot;; });\\'><span>Evening</span></label><label style=\\'display: flex; align-items: center; gap: 6px; cursor: pointer;\\' contenteditable=\\'false\\'><input type=\\'checkbox\\' style=\\'cursor: pointer;\\' onclick=\\'const container = this.closest(&quot;[data-medication-item]&quot;); const allCheckboxes = container.querySelectorAll(&quot;[data-day-checkboxes] input[type=checkbox]&quot;); const anyChecked = Array.from(allCheckboxes).some(cb => cb.checked); const radios = container.querySelectorAll(&quot;input[type=radio]&quot;); radios.forEach(r => { r.disabled = anyChecked; r.checked = false; r.parentElement.style.opacity = anyChecked ? &quot;0.5&quot; : &quot;1&quot;; r.parentElement.style.cursor = anyChecked ? &quot;not-allowed&quot; : &quot;pointer&quot;; });\\'><span>Night</span></label></div><div style=\\'display: flex; align-items: center; justify-content: space-between; margin-top: 8px;\\' data-interval-radios><div style=\\'display: flex; gap: 12px;\\'><label style=\\'display: flex; align-items: center; gap: 6px; cursor: pointer;\\' contenteditable=\\'false\\'><input type=\\'radio\\' name=\\'interval-' + Date.now() + '\\' style=\\'cursor: pointer;\\' onclick=\\'const container = this.closest(&quot;[data-medication-item]&quot;); const checkboxes = container.querySelectorAll(&quot;[data-day-checkboxes] input[type=checkbox]&quot;); checkboxes.forEach(cb => { cb.disabled = true; cb.checked = false; cb.parentElement.style.opacity = &quot;0.5&quot;; cb.parentElement.style.cursor = &quot;not-allowed&quot;; });\\'><span>Every 2h</span></label><label style=\\'display: flex; align-items: center; gap: 6px; cursor: pointer;\\' contenteditable=\\'false\\'><input type=\\'radio\\' name=\\'interval-' + Date.now() + '\\' style=\\'cursor: pointer;\\' onclick=\\'const container = this.closest(&quot;[data-medication-item]&quot;); const checkboxes = container.querySelectorAll(&quot;[data-day-checkboxes] input[type=checkbox]&quot;); checkboxes.forEach(cb => { cb.disabled = true; cb.checked = false; cb.parentElement.style.opacity = &quot;0.5&quot;; cb.parentElement.style.cursor = &quot;not-allowed&quot;; });\\'><span>Every 4h</span></label><label style=\\'display: flex; align-items: center; gap: 6px; cursor: pointer;\\' contenteditable=\\'false\\'><input type=\\'radio\\' name=\\'interval-' + Date.now() + '\\' style=\\'cursor: pointer;\\' onclick=\\'const container = this.closest(&quot;[data-medication-item]&quot;); const checkboxes = container.querySelectorAll(&quot;[data-day-checkboxes] input[type=checkbox]&quot;); checkboxes.forEach(cb => { cb.disabled = true; cb.checked = false; cb.parentElement.style.opacity = &quot;0.5&quot;; cb.parentElement.style.cursor = &quot;not-allowed&quot;; });\\'><span>Every 6h</span></label><label style=\\'display: flex; align-items: center; gap: 6px; cursor: pointer;\\' contenteditable=\\'false\\'><input type=\\'radio\\' name=\\'interval-' + Date.now() + '\\' style=\\'cursor: pointer;\\' onclick=\\'const container = this.closest(&quot;[data-medication-item]&quot;); const checkboxes = container.querySelectorAll(&quot;[data-day-checkboxes] input[type=checkbox]&quot;); checkboxes.forEach(cb => { cb.disabled = true; cb.checked = false; cb.parentElement.style.opacity = &quot;0.5&quot;; cb.parentElement.style.cursor = &quot;not-allowed&quot;; });\\'><span>Every 12h</span></label></div><button onclick=\\'const container = this.closest(&quot;[data-medication-item]&quot;); const radios = container.querySelectorAll(&quot;input[type=radio]&quot;); const checkboxes = container.querySelectorAll(&quot;[data-day-checkboxes] input[type=checkbox]&quot;); radios.forEach(r => { r.checked = false; r.disabled = false; r.parentElement.style.opacity = &quot;1&quot;; r.parentElement.style.cursor = &quot;pointer&quot;; }); checkboxes.forEach(cb => { cb.disabled = false; cb.parentElement.style.opacity = &quot;1&quot;; cb.parentElement.style.cursor = &quot;pointer&quot;; }); event.preventDefault();\\' style=\\'background: #6b7280; color: white; border: none; border-radius: 4px; padding: 2px 8px; cursor: pointer; font-size: 12px;\\' onmouseover=\\'this.style.background=&quot;#4b5563&quot;\\' onmouseout=\\'this.style.background=&quot;#6b7280&quot;\\' title=\\'Reset frequency selection\\' contenteditable=\\'false\\'>Reset</button></div></div>';container.querySelector('[data-medications-list]').appendChild(newMed);event.preventDefault();" style="background: #3b82f6; color: white; border: none; border-radius: 6px; padding: 4px 12px; cursor: pointer; font-size: 14px; font-weight: 500; display: flex; align-items: center; gap: 4px;" onmouseover="this.style.background='#2563eb'" onmouseout="this.style.background='#3b82f6'"><span style="font-size: 16px; font-weight: bold;">+</span> Add Medication</button><button contenteditable="false" onclick="if(confirm('Are you sure you want to remove this entire medication section?')) {this.closest('[data-medication-container]').remove();} event.preventDefault();" style="background: #dc2626; color: white; border: none; border-radius: 6px; padding: 4px 12px; cursor: pointer; font-size: 14px; font-weight: 500; display: flex; align-items: center; gap: 4px;" onmouseover="this.style.background='#b91c1c'" onmouseout="this.style.background='#dc2626'" title="Remove entire medication section"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6"/></svg> Remove Section</button></div></div><div data-medication-content style="transition: all 0.3s ease;"><div data-medications-list><div style="position: relative;" data-medication-item class="medication-item-hover" contenteditable="false"><button contenteditable="false" onclick="const items = this.closest('[data-medications-list]').querySelectorAll('[data-medication-item]');if (items.length > 1) {this.closest('[data-medication-item]').remove();} else {alert('Cannot remove the last medication. At least one medication must remain.');}event.preventDefault();" style="position: absolute; top: 0; right: 0; background: #ef4444; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 12px; display: flex; align-items: center; gap: 4px; opacity: 0; transition: opacity 0.2s ease-in-out;" onmouseover="this.style.background='#dc2626'" onmouseout="this.style.background='#ef4444'" title="Remove medication" class="delete-btn"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6"/></svg></button><div style="margin: 8px 0; padding-right: 60px; display: flex; align-items: center; gap: 8px;"><label style="color: #6b7280; font-weight: 500; min-width: 60px;">Name:</label><input type="text" data-drug-input placeholder="Enter medication name" style="flex: 1; padding: 6px 10px; border: none; border-radius: 6px; font-size: 14px; color: #1f2937; outline: none; background: transparent;" onfocus="this.style.background='#f9fafb'" onblur="this.style.background='transparent'"></div><div style="margin: 8px 0; display: flex; align-items: center; gap: 8px;"><label style="color: #6b7280; font-weight: 500; min-width: 60px;">Dosage:</label><input type="text" placeholder="Enter dosage" style="flex: 1; padding: 6px 10px; border: none; border-radius: 6px; font-size: 14px; color: #1f2937; outline: none; background: transparent;" onfocus="this.style.background='#f9fafb'" onblur="this.style.background='transparent'"></div><div style="margin: 8px 0;"><label style="display: block; color: #6b7280; margin-bottom: 6px; font-weight: 500;">Frequency:</label><div style="display: flex; flex-wrap: wrap; gap: 12px;" data-day-checkboxes><label style="display: flex; align-items: center; gap: 6px; cursor: pointer;" contenteditable="false"><input type="checkbox" style="cursor: pointer;" onclick="const container = this.closest('[data-medication-item]'); const allCheckboxes = container.querySelectorAll('[data-day-checkboxes] input[type=checkbox]'); const anyChecked = Array.from(allCheckboxes).some(cb => cb.checked); const radios = container.querySelectorAll('input[type=radio]'); radios.forEach(r => { r.disabled = anyChecked; r.checked = false; r.parentElement.style.opacity = anyChecked ? '0.5' : '1'; r.parentElement.style.cursor = anyChecked ? 'not-allowed' : 'pointer'; });"><span>Morning</span></label><label style="display: flex; align-items: center; gap: 6px; cursor: pointer;" contenteditable="false"><input type="checkbox" style="cursor: pointer;" onclick="const container = this.closest('[data-medication-item]'); const allCheckboxes = container.querySelectorAll('[data-day-checkboxes] input[type=checkbox]'); const anyChecked = Array.from(allCheckboxes).some(cb => cb.checked); const radios = container.querySelectorAll('input[type=radio]'); radios.forEach(r => { r.disabled = anyChecked; r.checked = false; r.parentElement.style.opacity = anyChecked ? '0.5' : '1'; r.parentElement.style.cursor = anyChecked ? 'not-allowed' : 'pointer'; });"><span>Afternoon</span></label><label style="display: flex; align-items: center; gap: 6px; cursor: pointer;" contenteditable="false"><input type="checkbox" style="cursor: pointer;" onclick="const container = this.closest('[data-medication-item]'); const allCheckboxes = container.querySelectorAll('[data-day-checkboxes] input[type=checkbox]'); const anyChecked = Array.from(allCheckboxes).some(cb => cb.checked); const radios = container.querySelectorAll('input[type=radio]'); radios.forEach(r => { r.disabled = anyChecked; r.checked = false; r.parentElement.style.opacity = anyChecked ? '0.5' : '1'; r.parentElement.style.cursor = anyChecked ? 'not-allowed' : 'pointer'; });"><span>Evening</span></label><label style="display: flex; align-items: center; gap: 6px; cursor: pointer;" contenteditable="false"><input type="checkbox" style="cursor: pointer;" onclick="const container = this.closest('[data-medication-item]'); const allCheckboxes = container.querySelectorAll('[data-day-checkboxes] input[type=checkbox]'); const anyChecked = Array.from(allCheckboxes).some(cb => cb.checked); const radios = container.querySelectorAll('input[type=radio]'); radios.forEach(r => { r.disabled = anyChecked; r.checked = false; r.parentElement.style.opacity = anyChecked ? '0.5' : '1'; r.parentElement.style.cursor = anyChecked ? 'not-allowed' : 'pointer'; });"><span>Night</span></label></div><div style="display: flex; align-items: center; justify-content: space-between; margin-top: 8px;" data-interval-radios><div style="display: flex; gap: 12px;"><label style="display: flex; align-items: center; gap: 6px; cursor: pointer;" contenteditable="false"><input type="radio" name="interval-initial" style="cursor: pointer;" onclick="const container = this.closest('[data-medication-item]'); const checkboxes = container.querySelectorAll('[data-day-checkboxes] input[type=checkbox]'); checkboxes.forEach(cb => { cb.disabled = true; cb.checked = false; cb.parentElement.style.opacity = '0.5'; cb.parentElement.style.cursor = 'not-allowed'; });"><span>Every 2h</span></label><label style="display: flex; align-items: center; gap: 6px; cursor: pointer;" contenteditable="false"><input type="radio" name="interval-initial" style="cursor: pointer;" onclick="const container = this.closest('[data-medication-item]'); const checkboxes = container.querySelectorAll('[data-day-checkboxes] input[type=checkbox]'); checkboxes.forEach(cb => { cb.disabled = true; cb.checked = false; cb.parentElement.style.opacity = '0.5'; cb.parentElement.style.cursor = 'not-allowed'; });"><span>Every 4h</span></label><label style="display: flex; align-items: center; gap: 6px; cursor: pointer;" contenteditable="false"><input type="radio" name="interval-initial" style="cursor: pointer;" onclick="const container = this.closest('[data-medication-item]'); const checkboxes = container.querySelectorAll('[data-day-checkboxes] input[type=checkbox]'); checkboxes.forEach(cb => { cb.disabled = true; cb.checked = false; cb.parentElement.style.opacity = '0.5'; cb.parentElement.style.cursor = 'not-allowed'; });"><span>Every 6h</span></label><label style="display: flex; align-items: center; gap: 6px; cursor: pointer;" contenteditable="false"><input type="radio" name="interval-initial" style="cursor: pointer;" onclick="const container = this.closest('[data-medication-item]'); const checkboxes = container.querySelectorAll('[data-day-checkboxes] input[type=checkbox]'); checkboxes.forEach(cb => { cb.disabled = true; cb.checked = false; cb.parentElement.style.opacity = '0.5'; cb.parentElement.style.cursor = 'not-allowed'; });"><span>Every 12h</span></label></div><button onclick="const container = this.closest('[data-medication-item]'); const radios = container.querySelectorAll('input[type=radio]'); const checkboxes = container.querySelectorAll('[data-day-checkboxes] input[type=checkbox]'); radios.forEach(r => { r.checked = false; r.disabled = false; r.parentElement.style.opacity = '1'; r.parentElement.style.cursor = 'pointer'; }); checkboxes.forEach(cb => { cb.disabled = false; cb.parentElement.style.opacity = '1'; cb.parentElement.style.cursor = 'pointer'; }); event.preventDefault();" style="background: #6b7280; color: white; border: none; border-radius: 4px; padding: 2px 8px; cursor: pointer; font-size: 12px;" onmouseover="this.style.background='#4b5563'" onmouseout="this.style.background='#6b7280'" title="Reset frequency selection" contenteditable="false">Reset</button></div></div></div></div></div></div></div>`;
        break;
      case "dietary":
        template = `<div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; margin: 8px 0; position: relative;" data-dietary-container contenteditable="false"><div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;"><div style="display: flex; align-items: center; gap: 8px;"><svg style="cursor: grab; color: #9ca3af; flex-shrink: 0;" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" title="Drag to reorder" data-drag-handle><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg><div style="display: flex; align-items: center; gap: 8px; cursor: pointer;" onclick="const content = this.closest('[data-dietary-container]').querySelector('[data-dietary-content]'); const icon = this.querySelector('[data-collapse-icon]'); if(content.style.display === 'none') { content.style.display = 'block'; icon.style.transform = 'rotate(0deg)'; } else { content.style.display = 'none'; icon.style.transform = 'rotate(-90deg)'; }"><svg data-collapse-icon width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transition: transform 0.2s ease;"><path d="M6 9l6 6 6-6"/></svg><p style="margin: 0; font-weight: 600; color: #1f2937;">🍎 Dietary Instructions</p></div></div><button contenteditable="false" onclick="if(confirm('Are you sure you want to remove this dietary instructions section?')) {this.closest('[data-dietary-container]').remove();} event.preventDefault();" style="background: #dc2626; color: white; border: none; border-radius: 6px; padding: 4px 12px; cursor: pointer; font-size: 14px; font-weight: 500; display: flex; align-items: center; gap: 4px;" onmouseover="this.style.background='#b91c1c'" onmouseout="this.style.background='#dc2626'" title="Remove dietary instructions section"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6"/></svg> Remove Section</button></div><div data-dietary-content style="transition: all 0.3s ease;"><div style="margin: 8px 0; display: flex; align-items: center; gap: 8px;"><label style="color: #6b7280; font-weight: 500; min-width: 120px;">Foods to Include:</label><input type="text" placeholder="Enter foods to include" style="flex: 1; padding: 6px 10px; border: none; border-radius: 6px; font-size: 14px; color: #10b981; outline: none; background: transparent;" onfocus="this.style.background='#f9fafb'" onblur="this.style.background='transparent'"></div><div style="margin: 8px 0; display: flex; align-items: center; gap: 8px;"><label style="color: #6b7280; font-weight: 500; min-width: 120px;">Foods to Avoid:</label><input type="text" placeholder="Enter foods to avoid" style="flex: 1; padding: 6px 10px; border: none; border-radius: 6px; font-size: 14px; color: #ef4444; outline: none; background: transparent;" onfocus="this.style.background='#f9fafb'" onblur="this.style.background='transparent'"></div></div></div>`;
        break;
      case "instructions":
        template = `<div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; margin: 8px 0; position: relative;" data-instructions-container contenteditable="false"><div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;"><div style="display: flex; align-items: center; gap: 8px;"><svg style="cursor: grab; color: #9ca3af; flex-shrink: 0;" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" title="Drag to reorder" data-drag-handle><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg><div style="display: flex; align-items: center; gap: 8px; cursor: pointer;" onclick="const content = this.closest('[data-instructions-container]').querySelector('[data-instructions-content]'); const icon = this.querySelector('[data-collapse-icon]'); if(content.style.display === 'none') { content.style.display = 'block'; icon.style.transform = 'rotate(0deg)'; } else { content.style.display = 'none'; icon.style.transform = 'rotate(-90deg)'; }"><svg data-collapse-icon width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transition: transform 0.2s ease;"><path d="M6 9l6 6 6-6"/></svg><p style="margin: 0; font-weight: 600; color: #1f2937;">📋 General Instructions</p></div></div><button contenteditable="false" onclick="if(confirm('Are you sure you want to remove this general instructions section?')) {this.closest('[data-instructions-container]').remove();} event.preventDefault();" style="background: #dc2626; color: white; border: none; border-radius: 6px; padding: 4px 12px; cursor: pointer; font-size: 14px; font-weight: 500; display: flex; align-items: center; gap: 4px;" onmouseover="this.style.background='#b91c1c'" onmouseout="this.style.background='#dc2626'" title="Remove general instructions section"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6"/></svg> Remove Section</button></div><div data-instructions-content style="transition: all 0.3s ease;"><textarea placeholder="Enter general instructions here..." style="width: 100%; min-height: 80px; padding: 8px 12px; border: none; border-radius: 6px; font-size: 14px; color: #1f2937; outline: none; background: transparent; resize: vertical; font-family: inherit;" onfocus="this.style.background='#f9fafb'" onblur="this.style.background='transparent'"></textarea></div></div>`;
        break;
    }

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = template;
    const fragment = document.createDocumentFragment();
    while (tempDiv.firstChild) {
      fragment.appendChild(tempDiv.firstChild);
    }

    slashRange.insertNode(fragment);
    setShowSlashCommand(false);
    editorElement.focus();
  };

  // Close command menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        showSlashCommand &&
        !(e.target as HTMLElement).closest("[data-slash-command]")
      ) {
        setShowSlashCommand(false);
      }

      if (
        showDrugSuggestions &&
        !(e.target as HTMLElement).closest("[data-drug-suggestions]") &&
        !(e.target as HTMLElement).hasAttribute("data-drug-input")
      ) {
        setShowDrugSuggestions(false);
      }
    };

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (showDrugSuggestions) {
        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            setSelectedDrugIndex((prev) =>
              prev < drugSuggestions.length - 1 ? prev + 1 : prev
            );
            break;
          case "ArrowUp":
            e.preventDefault();
            setSelectedDrugIndex((prev) => (prev > 0 ? prev - 1 : prev));
            break;
          case "Enter":
            e.preventDefault();
            if (drugSuggestions[selectedDrugIndex]) {
              selectDrug(drugSuggestions[selectedDrugIndex].name);
            }
            break;
          case "Escape":
            e.preventDefault();
            setShowDrugSuggestions(false);
            break;
        }
        return;
      }

      if (!showSlashCommand) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedCommandIndex((prev) =>
            prev < commandItems.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedCommandIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case "Enter":
          e.preventDefault();
          insertMedicationTemplate(commandItems[selectedCommandIndex].id);
          break;
        case "Escape":
          e.preventDefault();
          setShowSlashCommand(false);
          break;
      }
    };

    // Event delegation for drug input fields
    const handleDrugInputEvent = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.hasAttribute("data-drug-input")) {
        if (e.type === "input") {
          const value = target.value;
          setActiveDrugInput(target);

          // Get position of the input field
          const rect = target.getBoundingClientRect();
          const editorContainer = editorElement?.getBoundingClientRect();

          if (editorContainer) {
            setDrugSuggestionsPosition({
              top:
                rect.bottom -
                editorContainer.top +
                editorElement!.scrollTop +
                2,
              left: rect.left - editorContainer.left,
            });
          }

          fetchDrugSuggestions(value);
        }
      }
    };

    const editor = editorElement;
    editor?.addEventListener("input", handleDrugInputEvent, true);

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      editor?.removeEventListener("input", handleDrugInputEvent, true);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [
    showSlashCommand,
    selectedCommandIndex,
    commandItems,
    showDrugSuggestions,
    drugSuggestions,
    selectedDrugIndex,
  ]);

  // Drag and drop functionality with mouse events
  useEffect(() => {
    const editor = editorElement;
    if (!editor) {
      return;
    }

    let startX = 0;
    let startY = 0;
    let currentDragElement: HTMLElement | null = null;
    let placeholder: HTMLElement | null = null;
    let isDraggingNow = false;

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Check if clicking on drag handle SVG or its children (circle elements)
      let dragHandle: Element | null = null;

      if (target.hasAttribute("data-drag-handle")) {
        dragHandle = target;
      } else if (target.tagName === "circle" || target.tagName === "svg") {
        dragHandle = target.closest("[data-drag-handle]");
      }

      if (!dragHandle) {
        return;
      }

      // Find the component container
      const component = dragHandle.closest(
        "[data-medication-container], [data-dietary-container], [data-instructions-container]"
      ) as HTMLElement;
      if (!component) {
        return;
      }

      // Prevent text selection and contenteditable interference
      e.preventDefault();
      e.stopPropagation();

      startX = e.clientX;
      startY = e.clientY;
      currentDragElement = component;

      // Create placeholder
      placeholder = document.createElement("div");
      placeholder.style.cssText = `
        height: ${component.offsetHeight}px;
        border: 2px dashed #3b82f6;
        border-radius: 8px;
        margin: 8px 0;
        background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
        pointer-events: none;
        transition: all 0.2s ease;
        animation: pulse 1.5s ease-in-out infinite;
      `;
      placeholder.setAttribute("data-placeholder", "true");

      // Add keyframe animation for placeholder pulse
      if (!document.getElementById("drag-animations")) {
        const style = document.createElement("style");
        style.id = "drag-animations";
        style.textContent = `
          @keyframes pulse {
            0%, 100% { opacity: 0.6; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.01); }
          }
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `;
        document.head.appendChild(style);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!currentDragElement) return;

      const deltaX = Math.abs(e.clientX - startX);
      const deltaY = Math.abs(e.clientY - startY);

      // Start dragging after moving 5px
      if ((deltaX > 5 || deltaY > 5) && !isDraggingNow) {
        isDraggingNow = true;

        // Insert placeholder
        if (currentDragElement.parentNode) {
          currentDragElement.parentNode.insertBefore(
            placeholder!,
            currentDragElement
          );
        }

        // Make element follow cursor with smooth styling
        const rect = currentDragElement.getBoundingClientRect();
        currentDragElement.style.position = "fixed";
        currentDragElement.style.zIndex = "10000";
        currentDragElement.style.pointerEvents = "none";
        currentDragElement.style.opacity = "0.85";
        currentDragElement.style.boxShadow =
          "0 10px 40px rgba(59, 130, 246, 0.3)";
        currentDragElement.style.width = rect.width + "px";
        currentDragElement.style.transform = "rotate(2deg)";
        currentDragElement.style.cursor = "grabbing";
      }

      if (isDraggingNow && currentDragElement && editorElement) {
        // Move the component with cursor
        currentDragElement.style.left = `${
          e.clientX - currentDragElement.offsetWidth / 2
        }px`;
        currentDragElement.style.top = `${e.clientY - 20}px`;

        // Find drop position using elementFromPoint
        currentDragElement.style.pointerEvents = "none";
        const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
        currentDragElement.style.pointerEvents = "";

        if (elementBelow) {
          // First check if hovering over a component
          const dropTarget = elementBelow.closest(
            "[data-medication-container], [data-dietary-container], [data-instructions-container]"
          ) as HTMLElement;

          if (dropTarget && dropTarget !== currentDragElement && placeholder) {
            const rect = dropTarget.getBoundingClientRect();
            const midY = rect.top + rect.height / 2;

            // Remove placeholder from current position
            if (placeholder.parentNode) {
              placeholder.remove();
            }

            // Insert before or after based on cursor position
            if (e.clientY < midY) {
              dropTarget.parentNode?.insertBefore(placeholder, dropTarget);
            } else {
              dropTarget.parentNode?.insertBefore(
                placeholder,
                dropTarget.nextSibling
              );
            }
          } else if (
            elementBelow === editorElement ||
            editorElement.contains(elementBelow)
          ) {
            // Hovering over editor or text content
            // Find the closest text node or element to insert near
            let targetNode: Node | null = elementBelow;

            // If it's the editor itself, try to find a better insertion point
            if (targetNode === editorElement) {
              // Get all child nodes
              const children = Array.from(editorElement.childNodes);
              if (children.length > 0) {
                // Find the best insertion point based on Y position
                let bestNode: Node | null = null;
                let minDistance = Infinity;

                children.forEach((child) => {
                  if (child.nodeType === Node.ELEMENT_NODE) {
                    const childElement = child as HTMLElement;
                    // Skip the component being dragged and placeholder
                    if (
                      childElement === currentDragElement ||
                      childElement === placeholder
                    )
                      return;

                    const rect = childElement.getBoundingClientRect();
                    const distance = Math.abs(rect.top - e.clientY);
                    if (distance < minDistance) {
                      minDistance = distance;
                      bestNode = child;
                    }
                  } else if (
                    child.nodeType === Node.TEXT_NODE &&
                    child.textContent?.trim()
                  ) {
                    // For text nodes, create a range to get position
                    const range = document.createRange();
                    range.selectNodeContents(child);
                    const rect = range.getBoundingClientRect();
                    const distance = Math.abs(rect.top - e.clientY);
                    if (distance < minDistance) {
                      minDistance = distance;
                      bestNode = child;
                    }
                  }
                });

                if (bestNode) {
                  targetNode = bestNode;
                }
              }
            }

            if (targetNode && placeholder) {
              // Remove placeholder from current position
              if (placeholder.parentNode) {
                placeholder.remove();
              }

              // Determine if we should insert before or after based on position
              if (targetNode.nodeType === Node.ELEMENT_NODE) {
                const targetElement = targetNode as HTMLElement;
                const rect = targetElement.getBoundingClientRect();
                const midY = rect.top + rect.height / 2;

                if (e.clientY < midY) {
                  targetNode.parentNode?.insertBefore(placeholder, targetNode);
                } else {
                  targetNode.parentNode?.insertBefore(
                    placeholder,
                    targetNode.nextSibling
                  );
                }
              } else if (targetNode.nodeType === Node.TEXT_NODE) {
                // For text nodes, use range to determine insertion point
                const range = document.createRange();
                range.selectNodeContents(targetNode);
                const rect = range.getBoundingClientRect();
                const midY = rect.top + rect.height / 2;

                if (e.clientY < midY) {
                  targetNode.parentNode?.insertBefore(placeholder, targetNode);
                } else {
                  targetNode.parentNode?.insertBefore(
                    placeholder,
                    targetNode.nextSibling
                  );
                }
              }
            }
          }
        }
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!currentDragElement) return;

      if (isDraggingNow) {
        // Reset all drag styles immediately
        currentDragElement.style.position = "";
        currentDragElement.style.zIndex = "";
        currentDragElement.style.pointerEvents = "";
        currentDragElement.style.opacity = "";
        currentDragElement.style.boxShadow = "";
        currentDragElement.style.left = "";
        currentDragElement.style.top = "";
        currentDragElement.style.width = "";
        currentDragElement.style.transform = "";
        currentDragElement.style.transition = "";
        currentDragElement.style.cursor = "";
        currentDragElement.style.filter = "";

        // Insert at placeholder position
        if (placeholder && placeholder.parentNode) {
          placeholder.parentNode.insertBefore(currentDragElement, placeholder);
          placeholder.remove();
        }
      }

      currentDragElement = null;
      placeholder = null;
      isDraggingNow = false;
    };

    // Attach to document to catch all events
    document.addEventListener("mousedown", handleMouseDown, true);
    document.addEventListener("mousemove", handleMouseMove, false);
    document.addEventListener("mouseup", handleMouseUp, false);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown, true);
      document.removeEventListener("mousemove", handleMouseMove, false);
      document.removeEventListener("mouseup", handleMouseUp, false);
    };
  }, [editorElement]); // Re-run when editor element becomes available

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm print:hidden">
        <div className="max-w-5xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">
                New Prescription
              </h1>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handlePrint}
                className="flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Print
              </Button>
              <Button
                onClick={handleSave}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Save className="w-4 h-4" />
                Save
              </Button>
            </div>
          </div>

          {/* Formatting Toolbar */}
          <div className="flex items-center gap-2 flex-wrap border-t border-gray-300 pt-4 bg-gray-50 -mx-6 px-6 pb-4">
            {/* Text Style */}
            <div className="flex items-center gap-2 pr-4 border-r-2 border-gray-300">
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyFormat("bold")}
                className="h-10 w-10 p-0 bg-white hover:bg-blue-600 hover:text-white border-2 border-gray-400 hover:border-blue-600 shadow-sm text-gray-800"
                title="Bold (Ctrl+B)"
              >
                <Bold className="w-5 h-5 stroke-[3]" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyFormat("italic")}
                className="h-10 w-10 p-0 bg-white hover:bg-blue-600 hover:text-white border-2 border-gray-400 hover:border-blue-600 shadow-sm text-gray-800"
                title="Italic (Ctrl+I)"
              >
                <Italic className="w-5 h-5 stroke-[3]" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyFormat("underline")}
                className="h-10 w-10 p-0 bg-white hover:bg-blue-600 hover:text-white border-2 border-gray-400 hover:border-blue-600 shadow-sm text-gray-800"
                title="Underline (Ctrl+U)"
              >
                <Underline className="w-5 h-5 stroke-[3]" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyFormat("createLink")}
                className="h-10 w-10 p-0 bg-white hover:bg-blue-600 hover:text-white border-2 border-gray-400 hover:border-blue-600 shadow-sm text-gray-800"
                title="Insert/Edit Link"
              >
                <Link className="w-5 h-5 stroke-[3]" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyFormat("unlink")}
                className="h-10 w-10 p-0 bg-white hover:bg-red-600 hover:text-white border-2 border-gray-400 hover:border-red-600 shadow-sm text-gray-800"
                title="Remove Link"
              >
                <Unlink className="w-5 h-5 stroke-[3]" />
              </Button>
            </div>

            {/* Headings */}
            <div className="flex items-center gap-2 px-4 border-r-2 border-gray-300">
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyFormat("formatBlock", "h1")}
                className="h-10 w-10 p-0 bg-white hover:bg-blue-600 hover:text-white border-2 border-gray-400 hover:border-blue-600 shadow-sm text-gray-800"
                title="Heading 1"
              >
                <Heading1 className="w-5 h-5 stroke-[3]" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyFormat("formatBlock", "h2")}
                className="h-10 w-10 p-0 bg-white hover:bg-blue-600 hover:text-white border-2 border-gray-400 hover:border-blue-600 shadow-sm text-gray-800"
                title="Heading 2"
              >
                <Heading2 className="w-5 h-5 stroke-[3]" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyFormat("formatBlock", "h3")}
                className="h-10 w-10 p-0 bg-white hover:bg-blue-600 hover:text-white border-2 border-gray-400 hover:border-blue-600 shadow-sm text-gray-800"
                title="Heading 3"
              >
                <Heading3 className="w-5 h-5 stroke-[3]" />
              </Button>
            </div>

            {/* Lists */}
            <div className="flex items-center gap-2 px-4 border-r-2 border-gray-300">
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyFormat("insertUnorderedList")}
                className="h-10 w-10 p-0 bg-white hover:bg-blue-600 hover:text-white border-2 border-gray-400 hover:border-blue-600 shadow-sm text-gray-800"
                title="Bullet List"
              >
                <List className="w-5 h-5 stroke-[3]" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyFormat("insertOrderedList")}
                className="h-10 w-10 p-0 bg-white hover:bg-blue-600 hover:text-white border-2 border-gray-400 hover:border-blue-600 shadow-sm text-gray-800"
                title="Numbered List"
              >
                <ListOrdered className="w-5 h-5 stroke-[3]" />
              </Button>
            </div>

            {/* Alignment */}
            <div className="flex items-center gap-2 px-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyFormat("justifyLeft")}
                className="h-10 w-10 p-0 bg-white hover:bg-blue-600 hover:text-white border-2 border-gray-400 hover:border-blue-600 shadow-sm text-gray-800"
                title="Align Left"
              >
                <AlignLeft className="w-5 h-5 stroke-[3]" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyFormat("justifyCenter")}
                className="h-10 w-10 p-0 bg-white hover:bg-blue-600 hover:text-white border-2 border-gray-400 hover:border-blue-600 shadow-sm text-gray-800"
                title="Align Center"
              >
                <AlignCenter className="w-5 h-5 stroke-[3]" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyFormat("justifyRight")}
                className="h-10 w-10 p-0 bg-white hover:bg-blue-600 hover:text-white border-2 border-gray-400 hover:border-blue-600 shadow-sm text-gray-800"
                title="Align Right"
              >
                <AlignRight className="w-5 h-5 stroke-[3]" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="max-w-5xl mx-auto px-6 py-12 relative">
        <div className="bg-white rounded-lg shadow-lg min-h-[800px] p-12">
          {/* Title Input */}
          <Input
            type="text"
            placeholder="Prescription Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-4xl font-bold border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 mb-8 text-gray-900 placeholder:text-gray-400"
          />

          {/* Rich Text Editor */}
          <div
            ref={editorRef}
            contentEditable
            className="min-h-[600px] outline-none focus:outline-none text-gray-900 text-lg leading-relaxed [&_a]:text-blue-600 [&_a]:underline [&_a]:cursor-pointer [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:my-2 [&_li]:ml-4 relative"
            style={{
              caretColor: "#000",
            }}
            suppressContentEditableWarning
            onInput={handleEditorInput}
            onKeyDown={handleKeyDown}
            onMouseDown={(e) => {
              // Allow clicking on links
              const target = e.target as HTMLElement;
              if (target.tagName === "A") {
                e.preventDefault();
                const href = (target as HTMLAnchorElement).href;
                window.open(href, "_blank", "noopener,noreferrer");
              }
            }}
          >
            <p className="text-gray-500">
              Start writing your prescription... (Type "/" for quick insert)
            </p>

            {/* Slash Command Menu - Inside editor for proper relative positioning */}
            {showSlashCommand && (
              <div
                data-slash-command
                className="absolute bg-white border-2 border-blue-400 rounded-lg shadow-2xl z-[9999] w-80 overflow-hidden"
                style={{
                  top: `${slashCommandPosition.top}px`,
                  left: `${slashCommandPosition.left}px`,
                }}
              >
                <div className="p-2">
                  <div className="text-xs font-semibold text-gray-500 px-3 py-2">
                    Insert Template
                  </div>
                  {commandItems.map((item, index) => (
                    <div
                      key={item.id}
                      onClick={() => insertMedicationTemplate(item.id)}
                      className={`cursor-pointer rounded-lg px-3 py-3 mb-1 transition-colors ${
                        selectedCommandIndex === index
                          ? "bg-blue-100 border-2 border-blue-400"
                          : "hover:bg-gray-100 border-2 border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div
                          className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                            item.color === "blue"
                              ? "bg-blue-500"
                              : item.color === "green"
                              ? "bg-green-500"
                              : "bg-purple-500"
                          }`}
                        >
                          <item.icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-gray-900">
                            {item.label}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Drug Suggestions Dropdown */}
            {showDrugSuggestions && (
              <div
                data-drug-suggestions
                className="absolute bg-white border-2 border-blue-400 rounded-lg shadow-2xl z-[9999] w-96 overflow-hidden max-h-80 overflow-y-auto"
                style={{
                  top: `${drugSuggestionsPosition.top}px`,
                  left: `${drugSuggestionsPosition.left}px`,
                }}
              >
                <div className="p-1">
                  <div className="text-xs font-semibold text-gray-500 px-3 py-2">
                    Select Medication
                  </div>
                  {drugSuggestions.map((drug, index) => (
                    <div
                      key={index}
                      onClick={() => selectDrug(drug.name)}
                      className={`cursor-pointer rounded-lg px-3 py-2 mb-1 transition-colors ${
                        selectedDrugIndex === index
                          ? "bg-blue-100 border-2 border-blue-400"
                          : "hover:bg-gray-100 border-2 border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500">
                          <Pill className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm text-gray-900">
                            {drug.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:hidden {
            display: none !important;
          }
          .max-w-5xl {
            max-width: 100% !important;
          }
          .bg-white {
            background: white !important;
          }
          .shadow-lg {
            box-shadow: none !important;
          }
        }

        /* Editor Styles */
        [contenteditable] {
          -webkit-user-select: text;
          user-select: text;
        }

        [contenteditable]:empty:before {
          content: attr(placeholder);
          color: #9ca3af;
        }

        [contenteditable] h1 {
          font-size: 2em;
          font-weight: bold;
          margin-top: 0.67em;
          margin-bottom: 0.67em;
        }

        [contenteditable] h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin-top: 0.83em;
          margin-bottom: 0.83em;
        }

        [contenteditable] h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin-top: 1em;
          margin-bottom: 1em;
        }

        [contenteditable] ul,
        [contenteditable] ol {
          margin-left: 1.5em;
          margin-top: 0.5em;
          margin-bottom: 0.5em;
        }

        [contenteditable] li {
          margin-bottom: 0.25em;
        }

        [contenteditable] p {
          margin-bottom: 1em;
        }

        [contenteditable]:focus {
          outline: none;
        }

        /* Medication item hover effects */
        .medication-item-hover:hover .delete-btn {
          opacity: 1 !important;
        }

        /* Medication container hover effects */
        .medication-container-hover:hover .delete-container-btn {
          opacity: 1 !important;
        }

        /* Protect uneditable labels from deletion */
        .uneditable-label {
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }

        [contenteditable="false"] {
          user-select: none;
          -webkit-user-select: none;
          cursor: default;
        }
      `}</style>
    </div>
  );
}
