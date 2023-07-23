export interface Color {
  red: number;
  green: number;
  blue: number;
}


export type ColorType =
                 "black"      |
                 "white"      |
                 "red"        |
                 "orange"     |
                 "yellow"     |
                 "light-green"|
                 "green"      |
                 "dark-green" |
                 "cyan"       |
                 "light-blue" |
                 "blue"       |
                 "purple"     |
                 "magenta"    |
                 "pink";

export type DribblePalette = {
  name: ColorType, color: string, shots: string[]
}
