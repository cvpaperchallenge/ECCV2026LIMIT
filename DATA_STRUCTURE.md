# Data Structure Guide

This template uses **3 JSON files** to manage all workshop content. This simplified structure makes it easy to understand where to update information.

## File Overview

### 📋 workshop.json (Main Information)
**Size**: ~295 lines  
**Purpose**: Core workshop information that all workshops need

**Sections**:
- `home` - Homepage content (title, overview, news, dates)
- `schedule` - Workshop timeline and program
- `callForPapers` - Submission guidelines and topics
- `contact` - Contact information and FAQ

### 👥 people.json (People Information)
**Size**: ~67 lines  
**Purpose**: Information about organizers and speakers

**Sections**:
- `organizers` - Workshop organizing team
- `program` - Invited speakers and panel discussions

### ⭐ extras.json (Optional Content)
**Size**: ~140 lines  
**Purpose**: Optional sections that can be removed if not needed

**Sections**:
- `awards` - Award information (remove if no awards)
- `supporters` - Sponsor information (remove if no sponsors)
- `pastEvents` - Previous editions (remove for first-time workshops)

## Migration from Old Structure

The template previously used **9 separate JSON files**. They have been consolidated as follows:

### Old → New Mapping

**workshop.json** combines:
- ❌ `home.json` → ✅ `workshop.json` → `home` section
- ❌ `schedule.json` → ✅ `workshop.json` → `schedule` section
- ❌ `callForPapers.json` → ✅ `workshop.json` → `callForPapers` section
- ❌ `contact.json` → ✅ `workshop.json` → `contact` section

**people.json** combines:
- ❌ `organizers.json` → ✅ `people.json` → `organizers` section
- ❌ `program.json` → ✅ `people.json` → `program` section

**extras.json** combines:
- ❌ `awards.json` → ✅ `extras.json` → `awards` section
- ❌ `supporters.json` → ✅ `extras.json` → `supporters` section
- ❌ `pastEvents.json` → ✅ `extras.json` → `pastEvents` section

## Quick Access Guide

### "Where do I update the workshop title?"
→ `workshop.json` → `home.title`

### "Where do I add speakers?"
→ `people.json` → `program.invitedSpeakers`

### "Where do I update the schedule?"
→ `workshop.json` → `schedule.workshopProgram`

### "Where do I add organizers?"
→ `people.json` → `organizers.organizers`

### "Where do I add important dates?"
→ `workshop.json` → `home.importantDates` OR `schedule.importantDates`

### "Where do I add sponsors?"
→ `extras.json` → `supporters.supporters`

### "Where do I configure awards?"
→ `extras.json` → `awards`

## Example: Adding a New Speaker

Edit `people.json`:

```json
{
  "program": {
    "invitedSpeakers": [
      {
        "name": "Dr. Jane Smith",
        "affiliation": "University of Example",
        "photo": "/program/jane-smith.jpg",
        "website": "https://example.com/jane"
      }
    ]
  }
}
```

## Example: Updating Workshop Date

Edit `workshop.json`:

```json
{
  "home": {
    "eventInfo": {
      "date": "June 15, 2026, 9:00 AM",
      "location": "Convention Center - Hall A"
    }
  }
}
```

## Benefits of This Structure

✅ **Fewer files** - 3 instead of 9  
✅ **Logical grouping** - Related data stays together  
✅ **Easy to find** - Clear naming tells you what's inside  
✅ **Optional sections** - Remove `extras.json` if not needed  
✅ **Maintainable** - Changes are localized to specific files  

## Tips

1. **Start with workshop.json** - This has all the essential information
2. **Then update people.json** - Add your organizers and speakers
3. **Consider extras.json** - Only customize if you need these sections
4. **Use search** - Ctrl+F in your editor to find specific fields quickly
5. **Validate JSON** - Make sure your JSON is valid before testing (use a JSON validator)

---

This simplified structure makes managing your workshop website much easier!
