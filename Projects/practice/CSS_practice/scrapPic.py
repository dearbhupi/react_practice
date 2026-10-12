#pip install requests beautifulsoup4

import os
from urllib.parse import urljoin, urlparse
import requests
from bs4 import BeautifulSoup


def download_baby_animal_images():
  target_url = (
      "https://www.countryliving.com/life/kids-pets/g2659/baby-animal-photos/"
  )
  output_dir = "baby_animals"

  # Create directory if it doesn't exist
  os.makedirs(output_dir, exist_ok=True)

  # Set a User-Agent header to mimic a real browser request
  headers = {
      "User-Agent": (
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML,"
          " like Gecko) Chrome/120.0.0.0 Safari/537.36"
      )
  }

  print(f"Fetching webpage: {target_url}")
  response = requests.get(target_url, headers=headers)

  if response.status_code != 200:
    print(f"Failed to retrieve the webpage. Status code: {response.status_code}")
    return

  soup = BeautifulSoup(response.text, "html.parser")

  # Country Living stores gallery images inside figure/picture or img tags.
  # We will target image elements and look for high-res image sources.
  img_elements = soup.find_all("img")
  print(f"Found {len(img_elements)} total image tags. Filtering...")

  downloaded_count = 0

  for i, img in enumerate(img_elements):
    # Galleries often use data attributes (like data-src or srcset) for high-res images
    img_url = (
        img.get("data-src")
        or img.get("data-lazy-src")
        or img.get("src")
        or ""
    )

    if not img_url or "placeholder" in img_url or "logo" in img_url:
      continue

    # Make absolute URL if it's relative
    img_url = urljoin(target_url, img_url)

    # Filter out small UI icons, tracking pixels, or ads if needed
    if any(
        ext in img_url.lower()
        for ext in [".svg", ".gif", "pixel", "icon", "advertisement"]
    ):
      continue

    try:
      # Download image
      img_data = requests.get(img_url, headers=headers, timeout=10).content

      # Extract file extension from URL, default to .jpg
      parsed_path = urlparse(img_url).path
      ext = os.path.splitext(parsed_path)[1]
      if ext.lower() not in [".jpg", ".jpeg", ".png", ".webp"]:
        ext = ".jpg"

      filename = os.path.join(output_dir, f"baby_animal_{downloaded_count+1}{ext}")

      with open(filename, "wb") as f:
        f.write(img_data)

      print(f"Downloaded: {filename}")
      downloaded_count += 1

    except Exception as e:
      print(f"Could not download {img_url}: {e}")

  print(f"\nDone! Successfully downloaded {downloaded_count} images.")


if __name__ == "__main__":
  download_baby_animal_images()