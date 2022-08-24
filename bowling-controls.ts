import {GamepadControls, DropJoystickControls} from "../../api/lib/ControlTypes.js";
import {AsciiMapping} from "../../api/lib/AsciiMapping.js";
import {DosEmulatorImpl} from "../../api/lib/DosEmulatorImpl.js";
import {GamepadMapping} from "../../api/lib/GamepadMapping.js";

/**
 * ### BOWLING [CONTROLS] ###
 * --------------------------
 **
 * BOWLING game controls (DropJoystick and ScreenControls)
 */
export const buttons:GamepadControls[] & DropJoystickControls[] = [
    {
        'name': 'Up',
        'pressFunction': (dosGame:DosEmulatorImpl) => dosGame.pressKey(AsciiMapping.ARROW_UP, true),
        'releaseFunction': (dosGame:DosEmulatorImpl) => dosGame.pressKey(AsciiMapping.ARROW_UP, false),
        'gamepadButton': GamepadMapping.DPAD_UP
    },
    {
        'name': 'Down',
        'pressFunction': (dosGame:DosEmulatorImpl) => dosGame.pressKey(AsciiMapping.ARROW_DOWN, true),
        'releaseFunction': (dosGame:DosEmulatorImpl) => dosGame.pressKey(AsciiMapping.ARROW_DOWN, false),
        'gamepadButton': GamepadMapping.DPAD_DOWN
    },
    {
        'name': 'Left',
        'pressFunction': (dosGame:DosEmulatorImpl) => dosGame.pressKey(AsciiMapping.ARROW_LEFT, true),
        'releaseFunction': (dosGame:DosEmulatorImpl) => dosGame.pressKey(AsciiMapping.ARROW_LEFT, false),
        'gamepadButton': GamepadMapping.DPAD_LEFT
    },
    {
        'name': 'Right',
        'pressFunction': (dosGame:DosEmulatorImpl) => dosGame.pressKey(AsciiMapping.ARROW_RIGHT, true),
        'releaseFunction': (dosGame:DosEmulatorImpl) => dosGame.pressKey(AsciiMapping.ARROW_RIGHT, false),
        'gamepadButton': GamepadMapping.DPAD_RIGHT
    },
    {
        'name': 'Fire',
        'pressFunction': (dosGame) => dosGame.pressKey(AsciiMapping.SPACE, true),
        'releaseFunction': (dosGame) => dosGame.pressKey(AsciiMapping.SPACE, false),
        'gamepadButton': GamepadMapping.A
    },
]
