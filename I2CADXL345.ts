enum ADXL345Register {
    //% block="Device ID"
    DEVID = 0x00, // Device ID
    //% block="Tap threshold"
    THRESH_TAP = 0x1D, // Tap threshold
    //% block="X-axis offset"
    OFSX = 0x1E, // X-axis offset
    //% block="Y-axis offset"
    OFSY = 0x1F, // Y-axis offset
    //% block="Z-axis offset"
    OFSZ = 0x20, // Z-axis offset
    //% block="Tap duration"
    DUR = 0x21, // Tap duration
    //% block="Tap latency"
    LATENT = 0x22, // Tap latency
    //% block="Tap window"
    WINDOW = 0x23, // Tap window
    //% block="Activity threshold"
    THRESH_ACT = 0x24, // Activity threshold
    //% block="Inactivity threshold"
    THRESH_INACT = 0x25, // Inactivity threshold
    //% block="Inactivity time"
    TIME_INACT = 0x26, // Inactivity time
    //% block="Axis enable control for activity and inactivity detection"
    ACT_INACT_CTL = 0x27, // Axis enable control for activity and inactivity detection
    //% block="Free-fall threshold"
    THRESH_FF = 0x28, // Free-fall threshold
    //% block="Free-fall time"
    TIME_FF = 0x29, // Free-fall time
    //% block="Axis control for single/double tap"
    TAP_AXES = 0x2A, // Axis control for single/double tap
    //% block="Source for single/double tap"
    ACT_TAP_STATUS = 0x2B, // Source for single/double tap
    //% block="Data rate and power mode control"
    BW_RATE = 0x2C, // Data rate and power mode control
    //% block="Power-saving features control"
    POWER_CTL = 0x2D, // Power-saving features control
    //% block="Interrupt enable control"
    INT_ENABLE = 0x2E, // Interrupt enable control
    //% block="Interrupt mapping control"
    INT_MAP = 0x2F, // Interrupt mapping control
    //% block="Source of interrupts"
    INT_SOURCE = 0x30, // Source of interrupts
    //% block="Data format control"
    DATA_FORMAT = 0x31, // Data format control
    //% block="X-axis data 0"
    DATAX0 = 0x32, // X-axis data 0
    //% block="X-axis data 1"
    DATAX1 = 0x33, // X-axis data 1
    //% block="Y-axis data 0"
    DATAY0 = 0x34, // Y-axis data 0
    //% block="Y-axis data 1"
    DATAY1 = 0x35, // Y-axis data 1
    //% block="Z-axis data 0"
    DATAZ0 = 0x36, // Z-axis data 0
    //% block="Z-axis data 1"
    DATAZ1 = 0x37, // Z-axis data 1
    //% block="FIFO control"
    FIFO_CTL = 0x38, // FIFO control
    //% block="FIFO status"
    FIFO_STATUS = 0x39 // FIFO status
}

enum ADXL345DataRate {
    //% block=1600Hz
    D3200_HZ = 0b1111, // 1600Hz Bandwidth   140µA IDD
    //% block=800Hz
    D1600_HZ = 0b1110, //  800Hz Bandwidth    90µA IDD
    //% block=400Hz
    D800_HZ = 0b1101, //  400Hz Bandwidth   140µA IDD
    //% block=100Hz
    D400_HZ = 0b1100, //  200Hz Bandwidth   140µA IDD
    //% block=16g
    D200_HZ = 0b1011, //  100Hz Bandwidth   140µA IDD
    //% block=50Hz
    D100_HZ = 0b1010, //   50Hz Bandwidth   140µA IDD
    //% block=25Hz
    D50_HZ = 0b1001, //   25Hz Bandwidth    90µA IDD
    //% block=12.5Hz
    D25_HZ = 0b1000, // 12.5Hz Bandwidth    60µA IDD
    //% block=6.25Hz
    D12_5_HZ = 0b0111, // 6.25Hz Bandwidth    50µA IDD
    //% block=3.13Hz
    D6_25HZ = 0b0110, // 3.13Hz Bandwidth    45µA IDD
    //% block=1.56Hz
    D3_13_HZ = 0b0101, // 1.56Hz Bandwidth    40µA IDD
    //% block=0.78Hz
    D1_56_HZ = 0b0100, // 0.78Hz Bandwidth    34µA IDD
    //% block=0.39Hz
    D0_78_HZ = 0b0011, // 0.39Hz Bandwidth    23µA IDD
    //% block=0.20Hz
    D0_39_HZ = 0b0010, // 0.20Hz Bandwidth    23µA IDD
    //% block= 0.10Hz
    D0_20_HZ = 0b0001, // 0.10Hz Bandwidth    23µA IDD
    //% block=0.05Hz
    D0_10_HZ = 0b0000  // 0.05Hz Bandwidth    23µA IDD (default value)
}

enum ADXL345Range {
    //% block=16g
    R16_G = 0b11,   // +/- 16g
    //% block=8g
    R8_G = 0b10,   // +/- 8g
    //% block=4g
    R4_G = 0b01,   // +/- 4g
    //% block=2g
    R2_G = 0b00    // +/- 2g (default value)
}

enum ADXL345Dimension {
    //% block=x
    X = 0,
    //% block=y
    Y = 1,
    //% block=z
    Z = 2
}

//% weight=100 color=#00A654 icon="\uf085" block="I2C ADXL345"
namespace hhgyu {
    export class ADXL345 {
        private _address: number;
        private _range: ADXL345Range;

        //% blockId=ADXL345_constructor
        //% block="constructor$address|range$range"
        //% address.defl=0x53
        //% range.defl=ADXL345Range.R2_G
        public constructor(address: number = 0x53, range: ADXL345Range = ADXL345Range.R2_G) {
            this._address = address
            this._range = range;
        }

        //% blockId=ADXL345_begin2
        //% block="%adxl345|begin"
        public begin2() {
            this.begin()
        }

        //% blockId=ADXL345_begin
        //% block="%adxl345|begin"
        public begin(): boolean {
            /* Check connection */
            let deviceid: number = this.getDeviceID();
            if (deviceid != 0xE5) {
                return false;
            }

            // Enable measurements
            this.writeRegister(ADXL345Register.POWER_CTL, 0x08);

            this.setRange(this._range)

            return true;
        }

        //% blockId=ADXL345_setrange
        //% block="%adxl345|set range|$range"
        //% range.defl=ADXL345Range.R2_G
        public setRange(range: ADXL345Range = ADXL345Range.R2_G) {
            /* Read the data format register to preserve bits */
            let format = this.readRegister(ADXL345Register.DATA_FORMAT);

            /* Update the data rate */
            format &= ~0x0F;
            format |= range;

            /* Make sure that the FULL-RES bit is enabled for range scaling */
            format |= 0x08;

            /* Write the register back to the IC */
            this.writeRegister(ADXL345Register.DATA_FORMAT, format);

            /* Keep track of the current range (to avoid readbacks) */
            this._range = range;
        }

        //% blockId=ADXL345_getrange
        //% block="%adxl345|get range"
        public getRange(): ADXL345Range {
            /* Read the data format register to preserve bits */
            return this.readRegister(ADXL345Register.DATA_FORMAT) & 0x03;
        }

        //% blockId=ADXL345_setdatarate
        //% block="%adxl345|set datarate|$dataRate"
        //% dataRate.defl=ADXL345DataRate.D0_10_HZ
        public setDataRate(dataRate: ADXL345DataRate = ADXL345DataRate.D0_10_HZ) {
            this.writeRegister(ADXL345Register.BW_RATE, dataRate);
        }

        //% blockId=ADXL345_getdatarate
        //% block="%adxl345|get datarate"
        public getDataRate(): ADXL345DataRate {
            /* Read the data format register to preserve bits */
            return this.readRegister(ADXL345Register.BW_RATE) & 0x0F;
        }

        //% blockId=ADXL345_writeRegister
        //% block="%adxl345|write byte register $reg|value $value"
        //% reg.defl=ADXL345Register.DEVID
        //% value.defl=0
        public writeRegister(reg: ADXL345Register = ADXL345Register.DEVID, value: number = 0): void {
            let buf = pins.createBuffer(2)
            buf[0] = reg
            buf[1] = value
            pins.i2cWriteBuffer(this._address, buf, false)
        }

        //% blockId=ADXL345_readRegister
        //% block="%adxl345|read byte register $reg"
        //% reg.defl=ADXL345Register.DEVID
        public readRegister(reg: ADXL345Register = ADXL345Register.DEVID): number {
            pins.i2cWriteNumber(this._address, reg, NumberFormat.UInt8LE)
            return pins.i2cReadNumber(this._address, NumberFormat.UInt8LE)
        }

        //% blockId=ADXL345_readRegisterI16
        //% block="%adxl345|read word register $reg"
        //% reg.defl=ADXL345Register.DATAX0
        public readRegisterI16(reg: ADXL345Register = ADXL345Register.DATAX0): number {
            pins.i2cWriteNumber(this._address, reg, NumberFormat.UInt8LE)
            return pins.i2cReadNumber(this._address, NumberFormat.Int16LE)
        }

        //% blockId=ADXL345_getDeviceID
        //% block="%adxl345|deviceId"
        //% blockSetVariable=id
        public getDeviceID(): number {
            return this.readRegister(ADXL345Register.DEVID)
        }

        //% blockId=ADXL345_get
        //% block="%adxl345|get|$dim"
        //% dim.defl=ADXL345Dimension.X
        public get(dim: ADXL345Dimension = ADXL345Dimension.X): number {
            if (dim == ADXL345Dimension.X)
                return this.readRegisterI16(ADXL345Register.DATAX0)
            else if (dim == ADXL345Dimension.Y)
                return this.readRegisterI16(ADXL345Register.DATAX0)
            else if (dim == ADXL345Dimension.Z)
                return this.readRegisterI16(ADXL345Register.DATAZ0)
            return 0;
        }
    }

    //% blockId=ADXL345_new
    //% block="new address $address|range $range"
    //% address.defl=83
    //% range.defl=ADXL345Range.R2_G
    //% blockSetVariable=adxl345
    export function ADXL345New(address: number = 83, range: ADXL345Range = ADXL345Range.R2_G): ADXL345 {
        return new ADXL345(address, range)
    }
}