import categoryService from 'services/category.service';

class AppBootstrapService {
  async run() {
    await this.ensureGlobalCategories();
    // todo
    // await this.ensureDefaultImporters();
  }

  private async ensureGlobalCategories() {
    const existing = await categoryService.findGlobal();
    if (existing.length > 0) return;

    await categoryService.createGlobalDefaults();
  }
}

export default new AppBootstrapService();
