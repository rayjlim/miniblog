/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        environment: 'jsdom',
        globals: true,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html'],
            exclude: [
                'node_modules/**',
                'dist/**',
                '**/*.d.ts',
                'test/**',
                'vite.config.ts',
                'vitest.config.ts'
            ],
            include: ['src/**/*.{ts,tsx}']
        },
        alias: {
         'jest': 'vitest'
        }
    }
})
