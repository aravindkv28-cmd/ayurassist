// app/lib/ner.ts

import {
  pipeline,
  PipelineType, // Import the type
} from '@xenova/transformers';

class NerPipeline {
  static task: PipelineType = 'token-classification'; // Use the type
  static model = 'Xenova/bert-base-NER';
  static instance: any = null;
  static loading = false;

  static async getInstance() {
    if (this.instance === null && !this.loading) {
      try {
        this.loading = true;
        console.log('🔄 Loading NER model...');
        this.instance = await pipeline(this.task, this.model);
        console.log('✅ NER model loaded');
        return this.instance;
      } catch (error) {
        console.error('❌ Error loading NER model:', error);
        this.instance = null;
      } finally {
        this.loading = false;
      }
    } else if (this.loading) {
      // Wait if model is already loading
      await new Promise<void>((resolve) => {
        const check = () => {
          if (!this.loading) {
            resolve();
          } else {
            setTimeout(check, 100);
          }
        };
        check();
      });
    }
    return this.instance;
  }
}

export default NerPipeline;