require 'httparty'

def fromArrayToJavascriptString(array)
    array_string = array.map do |item|
        shots_without_backslash = item[:shots].to_s.gsub("\"", "'")
        "{ color: '##{item[:color]}', shots: #{shots_without_backslash} }"
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


    paletteColors = [
        black,
        white,
        red,
        orange,
        yellow,
        light_green,
        green,
        dark_green,
        cyan,
        light_blue,
        blue,
        purple,
        magenta,
        pink
    ]
    colors_result = []

    headers = {
        'x-requested-with': 'XMLHttpRequest'
    }
    paletteColors.each do |hex_color|
        puts "url https://dribbble.com/colors/for_404.json?hex=#{hex_color}"
        response = HTTParty.get(
            "https://dribbble.com/colors/for_404.json?hex=#{hex_color}",
            :headers => headers
        )
        #puts response.code
        # 200
        colors_result << { shots: parseShots(response.body), color: hex_color }
        sleep(1)
    end
    colors_result
end


string = fromArrayToJavascriptString(main).to_s.gsub('"{', '{').gsub('"}', '}')

File.write("log.js", "const results = #{string};")