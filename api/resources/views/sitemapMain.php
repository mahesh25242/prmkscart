<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <?php for($i=1; $i <=$data; $i++){?>
    <sitemap>
        <loc><?php echo url('/sitemap');?><?php echo $i;?>.xml</loc>
        <lastmod><?php echo date('Y-m-d', time()); ;?></lastmod>
    </sitemap>
    <?php } ?>
</sitemapindex>
