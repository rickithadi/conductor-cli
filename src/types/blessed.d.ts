// Type extensions for blessed to handle percentage strings
declare module 'blessed' {
  namespace Widgets {
    interface BoxOptions {
      width?: number | string;
      height?: number | string;
      top?: number | string;
      left?: number | string;
      bottom?: number | string;
      right?: number | string;
    }
    
    interface ListOptions extends BoxOptions {
      // Inherit extended options
    }
    
    interface LogOptions extends BoxOptions {
      // Inherit extended options
    }
    
    interface TextboxOptions extends BoxOptions {
      // Inherit extended options
    }
  }
}

export {};