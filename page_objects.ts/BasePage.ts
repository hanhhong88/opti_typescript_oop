import {Page} from "@playwright/test"
import path from "path";
export default class BasePage{
    protected page: Page
    constructor (page: Page) {
        this.page = page;
    }

   protected async clickToElement(locator: string) {
        await this.highlightElement(locator);
        await this.page.click(locator);
   }

   protected async doubleClickToElement(locator: string) {
        await this.highlightElement(locator);
        await this.page.dblclick(locator);
   }

   protected async highlightElement(locator: string){
        let originalStyle: string;
        const element = this.page.locator(locator);
        await element.evaluate(el => originalStyle = el.style.border);
        await element.evaluate(el => el.style.border = '2px dashed red'); //apply style
        await this.page.waitForTimeout(500);
        await element.evaluate(el => el.style.border = originalStyle);
   }

   protected async rightClickToElement(locator: string) {
        await this.highlightElement(locator);
        await this.page.click(locator, {button: 'right'});
   }

   protected async middleClickToElement(locator: string) {
        await this.highlightElement(locator);
        await this.page.click(locator, {button: 'middle'});
   }

   protected async fillElement(locator: string, value: string){
        await this.highlightElement(locator);
        await this.page.fill(locator, value);
   }

   protected async checkToCheckbox(locator: string){
          await this.highlightElement(locator);
          await this.page.check(locator);
   }

   protected async unCheckToCheckbox(locator: string){
     await this.highlightElement(locator);
     await this.page.uncheck(locator);
   }

   protected async hoverToElement(locator: string){
     await this.highlightElement(locator);
     await this.page.hover(locator);
   }

   protected async scrollToElement(locator: string){
     await this.page.locator(locator).scrollIntoViewIfNeeded();
   }

   protected async getPageUrl(){
     return this.page.url();
   }

   protected async getElementText(locator: string){
     return this.page.locator(locator).innerText();
   }

   protected async isElementCheck(locator: string){
     return this.page.locator(locator).isChecked();
   }

   protected async isElementVisible(locator: string){
     return this.page.locator(locator).isVisible();
   }

   protected async isElementHidden(locator: string){
     return this.page.locator(locator).isHidden();
   }

   protected async isElementEditable(locator: string){
     return this.page.locator(locator).isEditable();
   }

   protected async isElementEnabled(locator: string){
     return this.page.locator(locator).isEnabled();
   }

   protected async isElementDisable(locator: string){
     return this.page.locator(locator).isDisabled();
   }

   protected async selectToDropdown(locator: string, option: string){
     await this.page.locator(locator).selectOption({label: option});
   }

   protected async redirectToUrl(url: string){
     await this.page.goto(url);
   }

   protected async getInputValue(locator: string){
    await this.page.locator(locator).inputValue();
  }

  protected async getAtribute(locator: string, atributename: string){
    await this.page.locator(locator).getAttribute(atributename);
  }

  protected async reloadPage(){
    await this.page.reload();
  }

  protected async getNumberofElement(locator: string){
    const elements = await this.page.$$(locator);
    // const elements = await this.page.locator(locator).all();
    return elements.length;
  }

  protected async blurElement(locator: string){
    await this.page.locator(locator).blur();
  }

  protected async uploadFile(locator: string, fileName: string){
    const pathToFile = path.resolve(__dirname, fileName);
    await this.page.locator(locator).setInputFiles(pathToFile);
  }

  // upload files in the same folder
  protected async uploadMultiFile(locator: string, ...fileName: string[]){
    let filePaths: string[] = fileName.map(fileName => path.resolve(__dirname, fileName))
    await this.page.locator(locator).setInputFiles(filePaths);
  }

  protected async scollToPageTop(locator: string){
    await this.page.evaluate(() => window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    }));
  }

  protected async hideElement(locator: string){
    await this.page.locator(locator).evaluate(el => el.style.display = 'none !important');
  }

  protected async goBack(){
    await this.page.goBack();
  }

  protected async goForward(){
    await this.page.goForward();
  }

  protected async getPageSource(){
    await this.page.content();
  }

  protected async clickToElementInFrame(frameLocator: string, locator: string){
    const frameElement = this.page.frameLocator(frameLocator);
    await frameElement.locator(locator).click();
  }

  protected async fillToElementInFrame(frameLocator: string, locator: string, value: string){
    const frameElement = this.page.frameLocator(frameLocator);
    await frameElement.locator(locator).fill(value);
  }

  protected async waitForElementVisible(locator: string, timeout?: number){
    await this.page.locator(locator).waitFor({
      state: "visible",
      timeout: timeout
    });
  }

  protected async waitForElementInvisible(locator: string, timeout?: number){
    await this.page.locator(locator).waitFor({
      state: 'hidden',
      timeout: timeout
    });
  }

  protected async waitForElementPresent(locator: string, timeout?: number){
    await this.page.locator(locator).waitFor({
      state: 'attached',
      timeout: timeout
    });
  }

  protected async waitForElementDetattched(locator: string, timeout?: number){
    await this.page.locator(locator).waitFor({
      state: 'detached',
      timeout: timeout
    });
  }

  protected async getTextOfAllElement(locator: string): Promise<string[]>{
      const elements = await this.page.locator(locator).all();
      const textOfElement: string[] = [];
      for (let i=0; i<elements.length; i++){
        textOfElement.push(await elements[i].innerText());
      }

      return textOfElement;

  }

  protected async waitForPageLoad(maxRetries: number) {
    try {
        await this.page.waitForSelector('html', { state: 'attached' });
        await this.page.waitForLoadState('domcontentloaded');

        for (let attempt = 0; attempt < maxRetries; attempt++) {
            const pageLoadStatus = await this.page.evaluate(() => document.readyState);

            if (pageLoadStatus === "complete") {
                return;
            }

            // wait for a bit
            await this.page.waitForTimeout(500);
        }
       
        console.warn('Page did not reach "complete" status within retries')
    } catch (error) {
        console.log('Error waiting for page load: ', error);
    }
}


}