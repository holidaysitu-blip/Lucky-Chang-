# Lucky Chang

Lucky Chang is an AI themed-image app for the fixed Lucky Chang mascot.

The source mascot image is stored at:

- `public/lucky-chang.jpg`

Generation behavior:

- Use the provided Lucky Chang image as the fixed subject.
- Keep the yellow elephant body, large ears, round eyes, trunk, white tusks, white belly, and raised-hand friendly pose.
- Change only the theme, background, clothing accessories, props, lighting, and scene mood.
- Do not redesign the mascot or turn it into another character.

## Run Locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set `GEMINI_API_KEY` in `.env.local`.

3. Run the app:

   ```bash
   npm run dev
   ```
