# Rich Text Structure

This module contains helper functions to convert HTML or a DOM tree into a rich text structure and back, and to modify the structure with functions that are similar to `String` methods, and some additional ones for formatting.

A single record contains the selection, plain text, and formats.

## `create( element, range, multilineTag, settings )`

## `toHTMLString( record, multilineTag )`

## `apply( record, current, multilineTag )`

## `isCollapsed( record )`

## `isEmpty( record )`

## `applyFormat( record, format, start, end )`

## `removeFormat( record, formatType, start, end )`

## `getActiveFormat( record, formatType )`

## `getTextContent( record )`

## `slice( record, start, end )`

## `replace( record, pattern, replacement )`

## `insert( record, recordToInsert, start, end )`

## `remove( record, start, end )`

## `split( record, start, end )`

## `join( records, separator )`

## `concat( ...records )`
