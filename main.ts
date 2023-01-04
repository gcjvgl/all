function gas_mode () {
    if (pins.digitalReadPin(DigitalPin.P0) == 0) {
        music.playSoundEffect(music.builtinSoundEffect(soundExpression.twinkle), SoundExpressionPlayMode.UntilDone)
    } else {
        music.stopAllSounds()
    }
}
function automode () {
    auto_window()
    auto_led()
    gas_mode()
    temperature_fans()
}
bluetooth.onBluetoothConnected(function () {
    basic.showIcon(IconNames.House)
    connect_flag = 1
    while (connect_flag == 1) {
        bluetooth_val = bluetooth.uartReadUntil(serial.delimiters(Delimiters.Hash))
        serial.writeString("" + (bluetooth_val))
        serial.writeLine("")
        if (bluetooth_val == "a") {
            pins.digitalWritePin(DigitalPin.P16, 1)
        } else if (bluetooth_val == "b") {
            pins.digitalWritePin(DigitalPin.P16, 0)
        }
    }
})
bluetooth.onBluetoothDisconnected(function () {
    basic.showIcon(IconNames.Sad)
})
input.onButtonPressed(Button.A, function () {
    passwd_enter = "" + passwd_enter + "-"
    serial.writeString("" + (passwd_enter))
    serial.writeLine("")
    I2C_LCD1602.ShowString(passwd_enter, 0, 1)
})
input.onButtonPressed(Button.AB, function () {
    I2C_LCD1602.clear()
    if (passwd_enter == password) {
        basic.showIcon(IconNames.Duck)
        I2C_LCD1602.ShowString("successful", 0, 0)
        I2C_LCD1602.ShowString("open the door", 0, 1)
        pins.servoWritePin(AnalogPin.P8, 180)
        strip.setBrightness(100)
        strip.showColor(neopixel.colors(NeoPixelColors.Purple))
        strip.show()
    } else {
        I2C_LCD1602.ShowString("enter agin", 0, 0)
        I2C_LCD1602.ShowString("error", 0, 1)
        passwd_enter = ""
        basic.pause(1000)
        I2C_LCD1602.clear()
        I2C_LCD1602.ShowString("enter password", 0, 0)
    }
})
function auto_led () {
    if (pins.digitalReadPin(DigitalPin.P15) == 1) {
        pins.digitalWritePin(DigitalPin.P16, 1)
    } else {
        pins.digitalWritePin(DigitalPin.P16, 0)
    }
}
input.onButtonPressed(Button.B, function () {
    passwd_enter = "" + passwd_enter + "."
    serial.writeString("" + (passwd_enter))
    serial.writeLine("")
    I2C_LCD1602.ShowString(passwd_enter, 0, 1)
})
function auto_window () {
    water_vak = pins.digitalReadPin(DigitalPin.P0)
    if (water_vak > 300) {
        pins.servoWritePin(AnalogPin.P9, 0)
    } else {
        pins.servoWritePin(AnalogPin.P9, 100)
    }
}
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    for (let index = 0; index < 1; index++) {
        I2C_LCD1602.clear()
    }
    I2C_LCD1602.ShowString("close the door", 0, 0)
    pins.servoWritePin(AnalogPin.P8, 0)
    basic.pause(1000)
    passwd_enter = ""
    for (let index = 0; index < 1; index++) {
        I2C_LCD1602.clear()
    }
    I2C_LCD1602.ShowString("enter password", 0, 0)
    strip.clear()
    strip.show()
})
function temperature_fans () {
    temprature_val = input.temperature()
    serial.writeNumber(temprature_val)
    serial.writeLine("")
    if (temprature_val >= 35) {
        pins.analogWritePin(AnalogPin.P12, 500)
        pins.analogWritePin(AnalogPin.P13, 1023)
    } else {
        pins.analogWritePin(AnalogPin.P12, 0)
        pins.analogWritePin(AnalogPin.P13, 0)
    }
}
let temprature_val = 0
let water_vak = 0
let bluetooth_val = ""
let connect_flag = 0
let strip: neopixel.Strip = null
let passwd_enter = ""
let password = ""
serial.redirectToUSB()
basic.showIcon(IconNames.House)
pins.servoWritePin(AnalogPin.P9, 180)
I2C_LCD1602.LcdInit(39)
I2C_LCD1602.clear()
basic.pause(100)
I2C_LCD1602.ShowString("enter password", 0, 0)
pins.digitalWritePin(DigitalPin.P16, 0)
password = "..--"
passwd_enter = ""
strip = neopixel.create(DigitalPin.P14, 4, NeoPixelMode.RGB)
strip.clear()
strip.show()
basic.forever(function () {
    automode()
})
