<?php
/**
 * 自动加载函数
 * @param  [type] $strClassName 
 * @return [type] 
 */
function __autoload($strClassName) {
    $strClassFile = str_replace('_', '/', $strClassName) . '.php';
    $last_slash_pos = strrpos($strClassFile, '/', -1);
    if($last_slash_pos !== FALSE){
        $strClassFile = strtolower(substr($strClassFile,0, $last_slash_pos)) . substr($strClassFile, $last_slash_pos);
    }
    if (false !== ($path = exists_ex($strClassFile))){
        require_once($path);
    }
}

function exists_ex($strClassName){
    $dirs = explode(PATH_SEPARATOR, get_include_path());
    foreach($dirs as $dir){
        $path = rtrim($dir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $strClassName;
        if(file_exists($path)){
            return $path;
        }
    }
    return false;
}

?>