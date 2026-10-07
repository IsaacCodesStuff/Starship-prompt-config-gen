export interface LanguageSpec {
  id: string
  name: string
  prefix: string // the lowercase text Starship prints before the version
  sampleVersion: string // fake version shown in the preview
}

// Sample versions are illustrative, not meant to match your actual toolchain.
export const LANGUAGES: LanguageSpec[] = [
  { id: 'java', name: 'Java', prefix: 'java', sampleVersion: '21.0.2' },
  { id: 'python', name: 'Python', prefix: 'py', sampleVersion: '3.12.1' },
  { id: 'nodejs', name: 'Node.js', prefix: 'node', sampleVersion: 'v20.11.0' },
  { id: 'c', name: 'C', prefix: 'c', sampleVersion: '13.2.0' },
  { id: 'cpp', name: 'C++', prefix: 'c++', sampleVersion: '13.2.0' },
  { id: 'kotlin', name: 'Kotlin', prefix: 'kt', sampleVersion: '1.9.22' },
  { id: 'dart', name: 'Dart', prefix: 'dart', sampleVersion: '3.3.0' },
  { id: 'rust', name: 'Rust', prefix: 'rs', sampleVersion: '1.75.0' },
  { id: 'package', name: 'Package version', prefix: 'pkg', sampleVersion: '1.4.0' },
]