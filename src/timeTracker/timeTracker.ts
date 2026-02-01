export function trackTimeInterval(start: Date): string {
  const end = new Date();
  const diffMs = end.getTime() - start.getTime();

  const totalSeconds = Math.floor(diffMs / 1000);
  const seconds = totalSeconds % 60;
  const milliseconds = diffMs % 1000;

  const formatted = `${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;

  return formatted;
}
