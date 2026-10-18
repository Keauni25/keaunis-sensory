import argparse
import os
from pathlib import Path


def parse_args():
    parser = argparse.ArgumentParser(description='Generate a voiceover mp3 for the nursery rhyme video.')
    parser.add_argument('--voice', default='en-US-JennyNeural', help='Neural voice name for Edge TTS.')
    parser.add_argument('--text-file', default='scripts/lyrics.txt', help='Text file with one sentence per line or a single block of text.')
    parser.add_argument('--output', default='output/narration.mp3', help='Path to output MP3 file.')
    return parser.parse_args()


def main():
    args = parse_args()
    text_path = Path(args.text_file)
    out_path = Path(args.output)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    if not text_path.exists():
        raise FileNotFoundError(f'Missing text file: {text_path}')

    text = text_path.read_text(encoding='utf-8').strip()

    if not text:
        raise ValueError('Text file is empty.')

    # Use Edge TTS if installed; this keeps the voice less robotic and more natural.
    # pip install edge-tts
    try:
        import edge_tts
    except ImportError:
        print('edge-tts is not installed. Run:')
        print('python3 -m pip install edge-tts')
        raise

    communicate = edge_tts.Communicate(text, args.voice)
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(communicate.save(str(out_path)))
    print(f'Generated narration audio: {out_path}')


if __name__ == '__main__':
    import asyncio
    main()
