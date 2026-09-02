# Manu — Life Coach website

A simple 3-page bilingual (English / Italian) website, ready for GitHub Pages.

## How to change text (no code needed)

All the text on the site lives in two files:

- `content/content-en.json` — English text
- `content/content-it.json` — Italian text

Open either file directly on GitHub (click the file, then the pencil/edit icon), change the words between the quote marks, and commit. The website updates automatically. **Only edit the text between the quotation marks — keep the quotes, commas and curly brackets exactly as they are**, or the file will break.

Example — to change a testimonial:
```json
{
  "quote": "Working with Manu changed the way I see my own potential.",
  "name": "Giulia R."
}
```
Just replace the sentence inside `"quote"` and the name inside `"name"`.

## How to change images

Put your image files into the `images` folder, using **exactly these filenames** (the site is already wired up to look for them):

| Filename | Where it appears |
|---|---|
| `logo.jpg` | top of every page (~6cm × 2cm) |
| `Manu_face_pic.jpg` | large photo on the home page + top of "About the Coach" page |
| `qual_1.jpg` … `qual_5.jpg` | the 5 qualification images on the "About the Coach" page |

Just upload a new file with the same name to overwrite the old one — no code changes needed. Placeholder images are included so the site looks correct until you upload the real ones.

## Pages

- `index.html` — home page (hero photo, 2 cards, 4 testimonials, FAQ, Contact)
- `about-coach.html` — coach bio + qualifications
- `about-program.html` — program details

## Language switch

The **EN / IT** buttons at the top switch the whole site's language and remember the visitor's choice. Nothing to configure — it reads straight from the two content files above.

## Publishing on GitHub Pages

1. Create a new GitHub repository and upload all these files/folders (keep the folder structure as-is).
2. Go to **Settings → Pages**.
3. Under "Build and deployment", set **Source: Deploy from a branch**, branch: `main`, folder: `/ (root)`.
4. Save. Your site will be live at `https://<your-username>.github.io/<repo-name>/` within a minute or two.

## FAQ / Contact items

To add or remove an FAQ question, or edit contact details, edit the `faq` and `contact` sections inside the two content JSON files — same rule as above, just change the text between the quotes.
