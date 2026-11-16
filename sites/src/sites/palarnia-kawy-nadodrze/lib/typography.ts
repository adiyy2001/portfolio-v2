const unitPattern = /(\d) (g|ml|s|min|zł|kg|m(?= n\.p\.m))(?=[\s,.:;)]|$)/g;

export const holdUnits = (text: string): string => text.replace(unitPattern, '$1\u00a0$2');
