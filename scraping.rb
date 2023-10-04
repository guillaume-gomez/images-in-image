require 'httparty'

def fromArrayToJavascriptString(array)
    array_string = array.map do |item|
        shots_with_return = item[:shots].to_s
        shots_without_backslash = shots_with_return.gsub("\"", "'")
        "{ color: '##{item[:color]}', name: '#{item[:name]}', shots: #{shots_without_backslash} }"
    end

    array_string
end

def parseShots(body)
    shots = JSON.parse(body)["shots"]
    shots.map{|shot| shot["img"] }
end


def main
    black = "000000"
    white = "FFFFFF"
    red = "FF0000"
    orange = "ff8000"
    yellow = "ffff00"
    light_green = "80ff00"
    green = "00FF00"
    dark_green ="255000"
    cyan = "00FFFF"
    light_blue = "0080FF"
    blue = "0000FF"
    purple = "8000FF"
    magenta = "FF00FF"
    pink = "FF0080"

    # naming coming from ColorType (in utils.ts)
    paletteColors = [
        { name: "black", color: black },
        { name: "white", color: white },
        { name: "red", color: red },
        { name: "orange", color: orange },
        { name: "yellow", color: yellow },
        { name: "light-green", color: light_green },
        { name: "green", color: green },
        { name: "dark-green", color: dark_green },
        { name: "cyan", color: cyan },
        { name: "light-blue", color: light_blue },
        { name: "blue", color: blue },
        { name: "purple", color: purple },
        { name: "magenta", color: magenta },
        { name: "pink", color: pink }
    ]
    colors_result = []

    headers = {
        'x-requested-with': 'XMLHttpRequest'
    }
    paletteColors.each do |color_information|
        hex_color = color_information[:color]
        color_name = color_information[:name]

        puts "url https://dribbble.com/colors/for_404.json?hex=#{hex_color}"
        response = HTTParty.get(
            "https://dribbble.com/colors/for_404.json?hex=#{hex_color}",
            :headers => headers
        )
        #puts response.code
        # 200
        colors_result << { color: hex_color, name: color_name, shots: parseShots(response.body) }
        sleep(1)
    end
    colors_result
end


string = fromArrayToJavascriptString(main).to_s.gsub('"{', '{').gsub('}"', '}')

multiline = %Q(import { DribblePalette } from "../types";

  export const dribblePalette : DribblePalette[] = #{string};
)


File.open("src/Generated/dribblePalette.ts", "w") do |f|
  f.write "#{multiline}"
end