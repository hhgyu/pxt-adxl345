
//% weight=100 color=#00A654 icon="\uf085" block="I2C ADXL345"
namespace hhgyu {
    enum ADXL345Register {
        DEVID= 0x00, // Device ID
        THRESH_TAP= 0x1D, // Tap threshold
        OFSX= 0x1E, // X-axis offset
        OFSY= 0x1F, // Y-axis offset
        OFSZ= 0x20, // Z-axis offset
        DUR= 0x21, // Tap duration
        LATENT= 0x22, // Tap latency
        WINDOW= 0x23, // Tap window
        THRESH_ACT= 0x24, // Activity threshold
        THRESH_INACT= 0x25, // Inactivity threshold
        TIME_INACT= 0x26, // Inactivity time
        ACT_INACT_CTL= 0x27, // Axis enable control for activity and inactivity detection
        THRESH_FF= 0x28, // Free-fall threshold
        TIME_FF= 0x29, // Free-fall time
        TAP_AXES= 0x2A, // Axis control for single/double tap
        ACT_TAP_STATUS= 0x2B, // Source for single/double tap
        BW_RATE= 0x2C, // Data rate and power mode control
        POWER_CTL= 0x2D, // Power-saving features control
        INT_ENABLE= 0x2E, // Interrupt enable control
        INT_MAP= 0x2F, // Interrupt mapping control
        INT_SOURCE= 0x30, // Source of interrupts
        DATA_FORMAT= 0x31, // Data format control
        DATAX0= 0x32, // X-axis data 0
        DATAX1= 0x33, // X-axis data 1
        DATAY0= 0x34, // Y-axis data 0
        DATAY1= 0x35, // Y-axis data 1
        DATAZ0= 0x36, // Z-axis data 0
        DATAZ1= 0x37, // Z-axis data 1
        FIFO_CTL= 0x38, // FIFO control
        FIFO_STATUS= 0x39 // FIFO status
    }

    enum ADXL345DataRate {
        D3200_HZ    = 0b1111, // 1600Hz Bandwidth   140µA IDD
        D1600_HZ    = 0b1110, //  800Hz Bandwidth    90µA IDD
        D800_HZ     = 0b1101, //  400Hz Bandwidth   140µA IDD
        D400_HZ     = 0b1100, //  200Hz Bandwidth   140µA IDD
        D200_HZ     = 0b1011, //  100Hz Bandwidth   140µA IDD
        D100_HZ     = 0b1010, //   50Hz Bandwidth   140µA IDD
        D50_HZ      = 0b1001, //   25Hz Bandwidth    90µA IDD
        D25_HZ      = 0b1000, // 12.5Hz Bandwidth    60µA IDD
        D12_5_HZ    = 0b0111, // 6.25Hz Bandwidth    50µA IDD
        D6_25HZ     = 0b0110, // 3.13Hz Bandwidth    45µA IDD
        D3_13_HZ    = 0b0101, // 1.56Hz Bandwidth    40µA IDD
        D1_56_HZ    = 0b0100, // 0.78Hz Bandwidth    34µA IDD
        D0_78_HZ    = 0b0011, // 0.39Hz Bandwidth    23µA IDD
        D0_39_HZ    = 0b0010, // 0.20Hz Bandwidth    23µA IDD
        D0_20_HZ    = 0b0001, // 0.10Hz Bandwidth    23µA IDD
        D0_10_HZ    = 0b0000  // 0.05Hz Bandwidth    23µA IDD (default value)
    }

    enum ADXL345Range
    {
        R16_G          = 0b11,   // +/- 16g
        R8_G           = 0b10,   // +/- 8g
        R4_G           = 0b01,   // +/- 4g
        R2_G           = 0b00    // +/- 2g (default value)
    }

    class ADXL345 {
        private _address: number;
        private _range: ADXL345Range;
        
        public constructor(address: number = 0x53, range: ADXL345Range = ADXL345Range.R2_G) {
            this._address = address
            this._range = range;
        }

        public begin(): boolean {
            /* Check connection */
            let deviceid: number = this.getDeviceID();
            if (deviceid != 0xE5)
            {
                return false;
            }
            
            // Enable measurements
            this.writeRegister(ADXL345Register.POWER_CTL, 0x08);

            this.setRange(this._range)
                
            return true;
        }
        
        public setRange(range: ADXL345Range)
        {
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
        
        public getRange(): ADXL345Range
        {
          /* Read the data format register to preserve bits */
          return this.readRegister(ADXL345Register.DATA_FORMAT) & 0x03;
        }
        
        public setDataRate(dataRate: ADXL345DataRate)
        {
            this.writeRegister(ADXL345Register.BW_RATE, dataRate);
        }
        
        public getDataRate(): ADXL345Range
        {
            /* Read the data format register to preserve bits */
            return this.readRegister(ADXL345Register.BW_RATE) & 0x0F;
        }

        public writeRegister(reg:ADXL345Register, value: number):void {
            let buf = pins.createBuffer(2)
            buf[0] = reg
            buf[1] = value
            pins.i2cWriteBuffer(this._address, buf, false)
        }

        public readRegister(reg:ADXL345Register):number {
            pins.i2cWriteNumber(this._address, reg, NumberFormat.UInt8LE)
            return pins.i2cReadNumber(this._address, NumberFormat.UInt8LE)
        }
    
        public readRegisterU16(reg:ADXL345Register):number {
            pins.i2cWriteNumber(this._address, reg, NumberFormat.UInt8LE)
            return pins.i2cReadNumber(this._address, NumberFormat.UInt16LE)
        }
    
        public readRegisterI16(reg:ADXL345Register):number {
            pins.i2cWriteNumber(this._address, reg, NumberFormat.UInt8LE)
            return pins.i2cReadNumber(this._address, NumberFormat.Int16LE)
        }
    
        public getDeviceID():number {
            return this.readRegister(ADXL345Register.DEVID)
        }

        public getX():number {
            return this.readRegisterI16(ADXL345Register.DATAX0)
        }

        public getY():number {
            return this.readRegisterI16(ADXL345Register.DATAY0)
        }

        public getZ():number {
            return this.readRegisterI16(ADXL345Register.DATAZ0)
        }
    }
}
