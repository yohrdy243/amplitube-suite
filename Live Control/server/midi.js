import JZZ from 'jzz';

class MIDIController {
  constructor() {
    this.output = null;
    this.portName = process.env.MIDI_PORT_NAME || 'loopMIDI Port';
    this.channel = parseInt(process.env.MIDI_CHANNEL || '1') - 1; // MIDI channels are 0-indexed
    this.isConnected = false;
    this.portIndex = -1;
  }

  /**
   * Initialize MIDI connection
   * @returns {Promise<boolean>} Connection status
   */
  async connect() {
    try {
      // Initialize JZZ
      const engine = await JZZ();
      const outputs = engine.info().outputs;

      console.log(`\n🎹 MIDI Ports disponibles: ${outputs.length}`);

      // List all available ports
      outputs.forEach((port, i) => {
        console.log(`   [${i}] ${port.name}`);
      });

      // Find the configured port
      let foundPort = null;
      let foundIndex = -1;

      outputs.forEach((port, i) => {
        if (port.name.includes(this.portName)) {
          foundPort = port;
          foundIndex = i;
        }
      });

      if (foundPort) {
        this.output = engine.openMidiOut(foundPort.name);
        this.isConnected = true;
        this.portIndex = foundIndex;
        console.log(`\n✅ MIDI conectado: ${foundPort.name} (Canal ${this.channel + 1})`);
        return true;
      }

      console.warn(`\n⚠️  Puerto MIDI "${this.portName}" no encontrado`);
      console.warn(`   Configura loopMIDI en Windows y reinicia la app\n`);
      return false;

    } catch (error) {
      console.error('❌ Error al conectar MIDI:', error.message);
      return false;
    }
  }

  /**
   * Send Program Change message
   * @param {number} programNumber - Program number (0-127)
   */
  sendProgramChange(programNumber) {
    if (!this.isConnected) {
      console.warn('⚠️  MIDI no conectado - Program Change ignorado');
      return false;
    }

    if (programNumber < 0 || programNumber > 127) {
      console.error(`❌ Program Change inválido: ${programNumber} (debe ser 0-127)`);
      return false;
    }

    try {
      // Program Change usando JZZ
      this.output.program(this.channel, programNumber);
      console.log(`📤 Program Change: ${programNumber} (Canal ${this.channel + 1})`);
      return true;
    } catch (error) {
      console.error('❌ Error enviando Program Change:', error.message);
      return false;
    }
  }

  /**
   * Send Control Change message
   * @param {number} ccNumber - CC number (0-127)
   * @param {number} value - CC value (default: 127)
   */
  sendControlChange(ccNumber, value = 127) {
    if (!this.isConnected) {
      console.warn('⚠️  MIDI no conectado - Control Change ignorado');
      return false;
    }

    if (ccNumber < 0 || ccNumber > 127) {
      console.error(`❌ CC número inválido: ${ccNumber} (debe ser 0-127)`);
      return false;
    }

    if (value < 0 || value > 127) {
      console.error(`❌ CC valor inválido: ${value} (debe ser 0-127)`);
      return false;
    }

    try {
      // Control Change usando JZZ
      this.output.control(this.channel, ccNumber, value);
      console.log(`📤 Control Change: CC${ccNumber} = ${value} (Canal ${this.channel + 1})`);
      return true;
    } catch (error) {
      console.error('❌ Error enviando Control Change:', error.message);
      return false;
    }
  }

  /**
   * Get connection status
   */
  getStatus() {
    return {
      connected: this.isConnected,
      portName: this.portName,
      channel: this.channel + 1,
      portIndex: this.portIndex
    };
  }

  /**
   * Close MIDI connection
   */
  disconnect() {
    if (this.isConnected && this.output) {
      this.output.close();
      this.isConnected = false;
      console.log('🔌 MIDI desconectado');
    }
  }
}

// Singleton instance
const midiController = new MIDIController();

export default midiController;

