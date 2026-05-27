const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');

// 90mm × 54mm at 96 DPI (browser default)
const W = Math.round(90 / 25.4 * 96);   // 340px
const H = Math.round(54 / 25.4 * 96);   // 204px
const DPI_SCALE = 4;                     // 384 DPI output (> 300 DPI 인쇄 기준)

const FILE = `file://${path.resolve(__dirname, 'print.html')}`;

(async () => {
  const browser = await chromium.launch();

  // ── PDF (2-page: 앞면 + 뒷면) ──────────────────────────────
  {
    const page = await browser.newPage();
    await page.goto(FILE);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    await page.pdf({
      path: path.join(__dirname, 'JPARTNERS_BusinessCard.pdf'),
      printBackground: true,
      width: '90mm',
      height: '54mm',
    });
    await page.close();
    console.log('✓ JPARTNERS_BusinessCard.pdf');
  }

  // ── PNG 앞면 (384 DPI) ─────────────────────────────────────
  {
    const page = await browser.newPage({
      viewport: { width: W, height: H },
      deviceScaleFactor: DPI_SCALE,
    });
    await page.goto(FILE + '#front');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(__dirname, 'JPARTNERS_Front_KR.png'),
    });
    await page.close();
    console.log('✓ JPARTNERS_Front_KR.png  (앞면 국문)');
  }

  // ── PNG 뒷면 (384 DPI) ─────────────────────────────────────
  {
    const page = await browser.newPage({
      viewport: { width: W, height: H },
      deviceScaleFactor: DPI_SCALE,
    });
    await page.goto(FILE + '#back');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(__dirname, 'JPARTNERS_Back_EN.png'),
    });
    await page.close();
    console.log('✓ JPARTNERS_Back_EN.png   (뒷면 영문)');
  }

  await browser.close();
  console.log('\n완료 — 명함 인쇄소에 PDF 또는 PNG 파일을 제출하세요.');
  console.log('  PDF : 벡터 형식, 인쇄소 권장');
  console.log('  PNG : 384 DPI (1360×816px), 고해상도 래스터');
})();
