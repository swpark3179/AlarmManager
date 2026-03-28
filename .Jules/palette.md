## 2024-05-19 - Added ARIA labels for Korean accessibility
**Learning:** Found that Material-UI `IconButton`, `Fab`, and `Switch` components were missing `aria-label` attributes, making them inaccessible to screen readers. For this localized application, providing accurate Korean ARIA labels (e.g. `aria-label="새 알람 추가"`) improves accessibility substantially without disrupting the UI.
**Action:** When working on UI components in this application, ensure all icon-only buttons receive descriptive Korean `aria-label`s by default to maintain accessibility.
